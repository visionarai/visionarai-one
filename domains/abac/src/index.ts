import { type Connection, models } from "mongoose";
import { type MasterDataDocument, type MasterDataModelType, MasterDataSchema, type MasterDataType, resourceDataFromMasterData } from "./master_data";

import { type CreateNewPolicyInput, createPlaceholderPolicy, type PolicyDocument, type PolicyModelType, PolicySchema } from "./policy";

export * from "./master_data";
export * from "./policy";

export const createPolicyRepository = async (mongooseConnection: Connection) => {
	const MasterDataModel: MasterDataModelType =
		(models.MasterData as MasterDataModelType) || mongooseConnection.model<MasterDataDocument, MasterDataType>("MasterData", MasterDataSchema);
	const PolicyModel: PolicyModelType = (models.Policy as PolicyModelType) || mongooseConnection.model<PolicyDocument, PolicyModelType>("Policy", PolicySchema);

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
		createNewPolicy: async (createNewPolicyInput: CreateNewPolicyInput) => {
			const newPolicy = createPlaceholderPolicy(createNewPolicyInput, recentMasterData?.resources || []);

			return await PolicyModel.create(newPolicy);
		},
		getAllPolicies: async () =>
			await PolicyModel.find(
				{},
				{
					__v: 0,
				}
			).lean(),
		masterDataResourcesAndEnvironmentAttributes: () => {
			const resources = resourceDataFromMasterData(recentMasterData?.resources || []);
			const environmentAttributes = recentMasterData?.environmentAttributes || [];
			return { environmentAttributes, resources };
		},
		recentMasterData: () => recentMasterData as MasterDataType | null,
		updateMasterData: async (newMasterData: MasterDataType) => {
			await MasterDataModel.updateOne(
				{},
				{
					environmentAttributes: newMasterData.environmentAttributes,
					resources: newMasterData.resources,
					updatedAt: new Date(),
				},
				{ upsert: true }
			);
			await ensureMasterDataLoaded();
			return recentMasterData;
		},
	};
};

export type PolicyRepository = Awaited<ReturnType<typeof createPolicyRepository>>;
