import { type Document, type Model, Schema } from "mongoose";
import { type PolicyType, PolicyTypeSchema, type Subject } from "./policy.zod.js";
import { evaluatePolicy } from "./policy-evaluator.js";

// Instance methods type
type PolicyMethodsType = {
	evaluate: (resourceType: string, action: string, subject: Subject) => boolean;
};

// Statics type
type PolicyStaticsType = {
	findByName: (name: string) => Promise<PolicyDocument | null>;
};

// Document type
export type PolicyDocument = Omit<PolicyType, "_id"> & Document<string> & PolicyMethodsType & { _id: string };

// Model type
export type PolicyModelType = Model<PolicyDocument> & PolicyStaticsType;

// Mongoose schema for Policy
export const PolicySchema = new Schema<PolicyDocument, PolicyModelType, PolicyMethodsType>(
	{
		_id: { required: true, type: String },
		createdAt: { required: true, type: Date },
		createdBy: { required: true, type: String },
		description: { type: String },
		globalConditions: { type: Object }, // Use Object for structured data, validated by Zod
		name: { required: true, type: String, unique: true },
		permissions: { required: true, type: Object }, // Use Object for structured data, validated by Zod
		updatedAt: { required: true, type: Date },
	},
	{
		methods: {
			evaluate(resourceType: string, action: string, subject: Subject): boolean {
				const policy = this.toObject() as PolicyType;
				return evaluatePolicy({
					action,
					policy,
					resourceType,
					subject,
				});
			},
		},
		statics: {
			findByName(name: string) {
				return this.findOne({ name });
			},
		},
		timestamps: true,
	}
);

// Validate with Zod before saving
PolicySchema.pre("save", function (next) {
	const parsed = PolicyTypeSchema.safeParse(this.toObject());
	if (!parsed.success) {
		return next(new Error(`Policy validation failed: ${JSON.stringify(parsed.error.format())}`));
	}
	next();
});
