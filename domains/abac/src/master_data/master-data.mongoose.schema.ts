// biome-ignore lint/style/useNodejsImportProtocol: This is a node built-in module
import { createHash } from "crypto";
import { type Document, type Model, Schema } from "mongoose";
import type { MasterDataType } from "./master-data.zod";

type MasterDataHistoryEntry = Omit<MasterDataType, "version" | "_id" | "updatedAt" | "createdAt">;

export type MasterDataDocument = MasterDataType & {
	history?: {
		data: string;
		updatedAt: Date;
		hashedSnapshot: string;
	}[];
} & Document;
export type MasterDataModelType = Model<MasterDataDocument>;

const HistoryEntrySchema = new Schema(
	{
		data: { required: true, type: String },
		hashedSnapshot: { required: true, type: String },
		updatedAt: { required: true, type: Date },
	},
	{ _id: false }
);

export const MasterDataSchema = new Schema<MasterDataDocument>(
	{
		environmentAttributes: {
			_id: false,
			default: [],
			type: [
				{
					key: { required: true, type: String },
					type: { enum: ["string", "number", "boolean", "Date"], required: true, type: String },
				},
			],
		},
		history: { default: [], type: [HistoryEntrySchema] },
		resources: {
			_id: false,
			default: [],
			type: [
				{
					attributes: {
						_id: false,
						default: [],
						type: [
							{
								key: { required: true, type: String },
								type: { enum: ["string", "number", "boolean", "Date"], required: true, type: String },
							},
						],
					},
					name: { required: true, type: String },
					permissions: { type: [String] },
				},
			],
		},
		updatedBy: { required: true, type: String },
		version: { default: 1, type: Number },
	},
	{ timestamps: true }
).pre("updateOne", async function (next) {
	const filter = this.getFilter();
	const doc = await this.model.findOne(filter).exec();
	if (doc) {
		const currentUpdate = this.getUpdate();
		// Create a copy of the document and apply the update to simulate new state
		const newDoc = { ...doc.toObject(), ...currentUpdate };
		const entry = historyEntryFromDocument(newDoc as MasterDataDocument);
		const stringified = JSON.stringify(entry);
		const hash = createHashedSnapshot(stringified);
		const lastHash = doc.history?.[doc.history.length - 1]?.hashedSnapshot;
		if (lastHash !== hash) {
			const historyEntry = {
				data: stringified,
				hashedSnapshot: hash,
				updatedAt: new Date(),
			};
			this.setUpdate({
				...currentUpdate,
				$push: { history: historyEntry },
			});
		}
	}
	next();
});

export const createHashedSnapshot = (data: string): string => {
	const hash = createHash("sha256");
	hash.update(data);
	return hash.digest("hex");
};

function historyEntryFromDocument(doc: MasterDataDocument): MasterDataHistoryEntry {
	return {
		environmentAttributes: doc.environmentAttributes,
		resources: doc.resources,
		updatedBy: doc.updatedBy,
	};
}
