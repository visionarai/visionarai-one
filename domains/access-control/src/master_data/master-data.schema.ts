import { Schema } from "mongoose";
import type { MasterDataType } from "./master-data.types.js";

export const MasterDataSchema = new Schema<MasterDataType>(
	{
		resources: {
			of: new Schema({
				attributes: {
					of: {
						enum: ["string", "number", "boolean", "Date"],
						required: true,
						type: String,
					},
					type: Map,
				},
				permissions: [String],
			}),
			type: Map,
		},
	},
	{ timestamps: true }
);
