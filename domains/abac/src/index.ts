import { type Connection, type Model, models } from "mongoose";
import { type MasterDataDocument, MasterDataSchema, type MasterDataType } from "./master_data";

export * from "./master_data";
export * from "./policy";

export const createPolicyRepository = async (mongooseConnection: Connection) => {
	const MasterDataModel: Model<MasterDataDocument, MasterDataType> =
		(models.MasterData as Model<MasterDataDocument, MasterDataType>) ||
		mongooseConnection.model<MasterDataDocument, MasterDataType>("MasterData", MasterDataSchema);
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
		recentMasterData: () => recentMasterData as MasterDataType | null,
		updateMasterData: async (newMasterData: MasterDataType["resources"]) => {
			await MasterDataModel.updateOne({}, { resources: newMasterData }, { upsert: true });
			await ensureMasterDataLoaded();
			return recentMasterData;
		},
	};
};

export type PolicyRepository = Awaited<ReturnType<typeof createPolicyRepository>>;
