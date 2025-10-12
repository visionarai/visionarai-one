import type { Connection } from "mongoose";
import { type MasterDataDocument, type MasterDataModelType, MasterDataSchema, type MasterDataType, resourceDataFromMasterData } from "./master_data";

import {
	type CreateNewPolicyInput,
	createPlaceholderPolicy,
	type PermissionType,
	type PolicyDocument,
	type PolicyModelType,
	PolicySchema,
	type UpdatePolicyInput,
} from "./policy";

export * from "./master_data";
export * from "./policy";

export const createPolicyRepository = async (mongooseConnection: Connection) => {
	// Prefer connection-scoped models to avoid OverwriteModelError from global model recompilation
	const MasterDataModel: MasterDataModelType =
		(mongooseConnection.models.MasterData as MasterDataModelType) ||
		mongooseConnection.model<MasterDataDocument, MasterDataType>("MasterData", MasterDataSchema);
	const PolicyModel: PolicyModelType =
		(mongooseConnection.models.Policy as PolicyModelType) || mongooseConnection.model<PolicyDocument, PolicyModelType>("Policy", PolicySchema);

	let recentMasterData: MasterDataType | null;

	const ensureMasterDataLoaded = async () => {
		if (recentMasterData) {
			return;
		}
		const masterData = await MasterDataModel.findOne(
			{},
			{
				__v: 0,
				history: 0,
			}
		).lean();
		if (masterData) {
			masterData._id = masterData._id.toString();
		}

		if (!masterData?.resources) {
			return;
		}
		recentMasterData = masterData;
	};

	await ensureMasterDataLoaded();

	return {
		masterDataModify: async (newMasterData: MasterDataType) => {
			await MasterDataModel.updateOne(
				{},
				{
					environmentAttributes: newMasterData.environmentAttributes,
					resources: newMasterData.resources,
					updatedAt: new Date(),
					updatedBy: newMasterData.updatedBy,
				},
				{ upsert: true }
			);
			await ensureMasterDataLoaded();
			return recentMasterData;
		},
		masterDataResourcesAndEnvironmentAttributes: () => {
			const resources = resourceDataFromMasterData(recentMasterData?.resources || []);
			const environmentAttributes = recentMasterData?.environmentAttributes || [];
			return { environmentAttributes, resources };
		},
		masterDataRetrieve: () => recentMasterData as MasterDataType | null,
		policiesListAll: async () =>
			await PolicyModel.find(
				{},
				{
					__v: 0,
				}
			).lean(),
		policyDuplicateById: async (policyId: string) => {
			const existingPolicy = await PolicyModel.findById(policyId).lean();
			if (!existingPolicy) {
				throw new Error("Policy not found");
			}
			const duplicatedPolicy = {
				...existingPolicy,
				_id: undefined,
				createdAt: new Date(),
				name: `${existingPolicy.name} (Copy)`,
				updatedAt: new Date(),
				version: 1,
			};
			return await PolicyModel.create(duplicatedPolicy);
		},
		policyRegisterNew: async (createNewPolicyInput: CreateNewPolicyInput) => {
			const newPolicy = createPlaceholderPolicy(createNewPolicyInput, recentMasterData?.resources || []);
			return await PolicyModel.create(newPolicy);
		},
		policyRemoveById: async (policyId: string) => {
			const result = await PolicyModel.deleteOne({ _id: policyId }).exec();
			return result.deletedCount === 1;
		},
		policyUpdateById: async (policyId: string, updatedFields: UpdatePolicyInput) => {
			const updateData = {
				...updatedFields,
				updatedAt: new Date(),
			};
			const updatedPolicy = await PolicyModel.findByIdAndUpdate(policyId, updateData, { new: true }).lean();
			if (updatedPolicy) {
				updatedPolicy._id = updatedPolicy._id.toString();
			}
			return updatedPolicy;
		},
		policyUpdatePermissionForResourceAction: async (policyId: string, resource: string, action: string, permission: PermissionType) => {
			const update = {
				$inc: { __v: 1 },
				$set: {
					[`permissions.${resource}.${action}`]: permission,
				},
			};

			const updatedPolicy = await PolicyModel.findByIdAndUpdate(policyId, update, { new: true }).lean();

			if (!updatedPolicy) {
				throw new Error("Policy not found or resource action not found within the policy");
			}

			updatedPolicy._id = updatedPolicy._id.toString();
			return updatedPolicy;
		},
	};
};

export type PolicyRepository = Awaited<ReturnType<typeof createPolicyRepository>>;
