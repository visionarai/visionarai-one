import { type Connection, type Model, models } from "mongoose";
import { type MasterDataDocument, MasterDataSchema, type MasterDataType } from "./master_data";

export * from "./master_data";

export const createPolicyRepository = async (mongooseConnection: Connection) => {
	const MasterDataModel: Model<MasterDataDocument, MasterDataType> =
		(models.MasterData as Model<MasterDataDocument, MasterDataType>) ||
		mongooseConnection.model<MasterDataDocument, MasterDataType>("MasterData", MasterDataSchema);
	let recentMasterData: MasterDataType["resources"] | null = null;

	const ensureMasterDataLoaded = async () => {
		if (recentMasterData) {
			return;
		}
		const masterData = await MasterDataModel.findOne().lean();
		if (!masterData?.resources) {
			throw new Error("Master data not found");
		}
		recentMasterData = masterData.resources;
	};

	await ensureMasterDataLoaded();

	return {
		recentMasterData,
	};
};
