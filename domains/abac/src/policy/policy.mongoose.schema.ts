import { type Document, type Model, Schema } from "mongoose";
import type { PersistedPolicy } from "./policy.zod";

export type PolicyDocument = PersistedPolicy & Document;

type PolicyStaticsType = {
	findByName: (name: string) => Promise<PolicyDocument | null>;
};

export type PolicyModelType = Model<PolicyDocument> & PolicyStaticsType;

export const PolicySchema = new Schema<PolicyDocument, PolicyModelType>(
	{
		createdBy: { required: true, type: String },
		description: { type: String },
		name: { required: true, type: String },
		permissions: { required: true, type: Schema.Types.Mixed },
		version: { default: 1, type: Number },
	},
	{
		collection: "policies",

		statics: {
			findByName(name: string) {
				return this.findOne({ name }).exec();
			},
		},
		timestamps: true,
	}
);
