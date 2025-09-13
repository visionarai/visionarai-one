import { type Document, type Model, Schema } from "mongoose";
import type { MasterDataType } from "./master-data.zod";

export type MasterDataDocument = MasterDataType & Document;
export type MasterDataModelType = Model<MasterDataDocument>;

export const MasterDataSchema = new Schema<MasterDataDocument>(
	{
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
					permissions: { type: String },
				},
			],
		},
	},
	{ timestamps: true }
);
