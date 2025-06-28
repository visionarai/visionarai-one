import { Connection, Model, models, Types } from 'mongoose';
import { AppError } from './error/index.js';
import { MasterDataSchema } from './master_data/master_data.schema.js';
import { MasterDataType } from './master_data/master_data.types.js';
import { PolicySchema, Subject, type PolicyType } from './policy/index.js';

export function isAccessControlDomain(): boolean {
  return true;
}

export const createPolicyRepository = (mongooseConnection: Connection) => {
  const PolicyModel: Model<PolicyType> = models['Policy'] || mongooseConnection.model<PolicyType>('Policy', PolicySchema);
  const MasterDataModel: Model<MasterDataType> = models['MasterData'] || mongooseConnection.model<MasterDataType>('MasterData', MasterDataSchema);

  let recentMasterData: MasterDataType['resources'] = {};
  let allowedResourceTypes: string[] = [];
  const loadMostRecentMasterData = async (): Promise<void> => {
    if (recentMasterData) {
      return;
    }
    const masterData = await MasterDataModel.findOne().sort({ createdAt: -1 }).exec();
    if (!masterData || !masterData.resources) {
      throw new AppError('MASTER_DATA_NOT_FOUND', {
        context: { location: 'createPolicyRepository.loadMostRecentMasterData' },
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
        isPermissionGranted: (subject: Subject, resourceType: string, action: string): boolean => {
          if (!allowedResourceTypes.includes(resourceType)) {
            throw new AppError('RESOURCE_TYPE_NOT_ALLOWED', {
              context: { location: 'createPolicyRepository.getPolicyById.isPermissionGranted', resourceType },
              metadata: { resource: resourceType },
            });
          }
          const permissions = policy.permissions[resourceType];
          if (!permissions || !permissions[action]) {
            return false; // No permission defined for this action
          }
          const permission = permissions[action];
          if (typeof permission === 'boolean') {
            return permission; // Direct boolean permission
          }
          if (typeof permission === 'object' && 'field' in permission && 'operation' in permission && 'value' in permission) {
            // Handle condition
            const condition = permission as { field: string; operation: string; value: unknown };
            // const subjectValue = subject[condition.field.replace('subject.', '')];
            // switch (condition.operation) {
            //   case 'equals':
            //     if (subjectValue !== condition.value) {
            //       return false;
            //     }
            //     break;
            // }
          }
          return false; // Default to false if no conditions match
        },
      };
    },
    async createPolicy(policyData: any) {
      const policy = new PolicyModel(policyData);
      return policy.save();
    },
    // Add more methods as needed
  };
};
