import { type Connection, type Model, models, Types } from 'mongoose';
import { AppError } from './error/index.js';
import { MasterDataSchema, type MasterDataType } from './master_data/index.js';
import {
  type PolicyDocument,
  type PolicyModelType,
  PolicySchema,
  type PolicyType,
  type Subject,
} from './policy/index.js';

export function isAccessControlDomain(): boolean {
  return true;
}

export const createPolicyRepository = (mongooseConnection: Connection) => {
  const PolicyModel =
    (models.Policy as Model<PolicyDocument, PolicyModelType>) ||
    mongooseConnection.model<PolicyDocument, PolicyModelType>(
      'Policy',
      PolicySchema
    );
  const MasterDataModel: Model<MasterDataType> =
    models.MasterData ||
    mongooseConnection.model<MasterDataType>('MasterData', MasterDataSchema);

  let recentMasterData: MasterDataType['resources'] = {};
  let allowedResourceTypes: string[] = [];
  const loadMostRecentMasterData = async (): Promise<void> => {
    if (recentMasterData) {
      return;
    }
    const masterData = await MasterDataModel.findOne()
      .sort({ createdAt: -1 })
      .exec();
    if (!masterData?.resources) {
      throw new AppError('MASTER_DATA_NOT_FOUND', {
        context: {
          location: 'createPolicyRepository.loadMostRecentMasterData',
        },
      });
    }
    recentMasterData = masterData.resources;
    allowedResourceTypes = Object.keys(recentMasterData);
  };

  loadMostRecentMasterData();

  return {
    async getPolicyById(id: string) {
      const objectId = new Types.ObjectId(id);
      const policy = await PolicyModel.findById(objectId);
      if (!policy) {
        throw new AppError('POLICY_NOT_FOUND', {
          context: { location: 'createPolicyRepository.getPolicyById', id },
        });
      }

      return {
        isPermissionGranted: (
          subject: Subject,
          resourceType: string,
          action: string
        ): boolean => {
          if (!allowedResourceTypes.includes(resourceType)) {
            throw new AppError('RESOURCE_TYPE_NOT_ALLOWED', {
              context: {
                location:
                  'createPolicyRepository.getPolicyById.isPermissionGranted',
                resourceType,
              },
              metadata: { resource: resourceType },
            });
          }
          return policy.evaluate(resourceType, action, subject);
        },
      };
    },
    createPolicy(policyData: PolicyType): Promise<PolicyDocument> {
      const policy = new PolicyModel(policyData);
      return policy.save();
    },
    // Add more methods as needed
  };
};
