import { type Document, type FlatRecord, type Model, Schema } from "mongoose";
import type { MasterDataType } from "./master-data.zod";

type MasterDataHistoryEntry = Omit<MasterDataType, "version" | "_id" | "updatedAt" | "createdAt">;

export type MasterDataDocument = MasterDataType & {
	history?: MasterDataHistoryEntry[];
} & Document;
export type MasterDataModelType = Model<MasterDataDocument>;

function historyEntryFromDocument(
	doc: FlatRecord<MasterDataDocument> &
		Required<{
			_id: string;
		}> & {
			__v: number;
		}
): MasterDataHistoryEntry {
	return {
		environmentAttributes: doc.environmentAttributes,
		resources: doc.resources,
		updatedBy: doc.updatedBy,
	};
}

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
		history: { required: false, type: Array<MasterDataHistoryEntry> },
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
).pre("updateOne", function (next) {
	// Note: 'this' refers to the query, not the document
	const update = this.getUpdate() as Partial<MasterDataDocument>;
	if (update) {
		// We need to fetch the current document to create a history entry
		this.model
			.findOne(this.getQuery())
			.then((doc: MasterDataDocument | null) => {
				if (doc) {
					const historyEntry = historyEntryFromDocument(doc.toObject());
					const newVersion = (doc.version ?? 0) + 1;
					this.setUpdate({
						...update,
						history: [...(doc.history ?? []), historyEntry],
						version: newVersion,
					});
				}
				next();
			})
			.catch((err) => {
				next(err);
			});
	} else {
		next();
	}
});
