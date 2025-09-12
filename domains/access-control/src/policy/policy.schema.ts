import { type Document, type Model, Schema } from "mongoose";
import { type EvaluationContext, evaluateNormalizedPolicy } from "./normalized-evaluator.js";
import { type NormalizedPolicy, PersistedPolicySchema } from "./normalized-policy.zod.js";

// Instance methods type (normalized)
type PolicyMethodsType = {
	evaluate: (ctx: Omit<EvaluationContext, "resourceType" | "action"> & { resourceType: string; action: string }) => boolean;
};

// Statics type
type PolicyStaticsType = {
	findByName: (name: string) => Promise<PolicyDocument | null>;
};

// Document type (normalized PersistedPolicy without _id field duplication)
export type PolicyDocument = Omit<NormalizedPolicy, "_id"> & Document<string> & PolicyMethodsType & { _id: string };

// Model type
export type PolicyModelType = Model<PolicyDocument> & PolicyStaticsType;

// Mongoose schema for normalized policy
export const PolicySchema = new Schema<PolicyDocument, PolicyModelType, PolicyMethodsType>(
	{
		_id: { required: true, type: String },
		createdAt: { required: true, type: Date },
		createdBy: { required: true, type: String },
		description: { type: String },
		global: { type: Object }, // { root: string | null }
		name: { required: true, type: String, unique: true },
		nodes: { required: true, type: Object }, // Record<string, ConditionNode>
		permissions: { required: true, type: Object }, // Record<resource, Record<action, decision>>
		updatedAt: { required: true, type: Date },
		updatedBy: { required: true, type: String },
		version: { required: true, type: Number },
	},
	{
		methods: {
			evaluate(ctx): boolean {
				const policy = this.toObject() as unknown as NormalizedPolicy;
				return evaluateNormalizedPolicy(policy, ctx);
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

// Zod validation hook for normalized policy shape
PolicySchema.pre("save", function (next) {
	const parsed = PersistedPolicySchema.safeParse(this.toObject());
	if (!parsed.success) {
		return next(new Error(`Policy validation failed: ${JSON.stringify(parsed.error.format())}`));
	}
	next();
});
