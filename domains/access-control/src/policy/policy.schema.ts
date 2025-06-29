import { Document, Model, Schema } from 'mongoose';
import { evaluatePolicy } from './policy-evaluator.js';
import { PolicyType, PolicyTypeSchema, Subject } from './policy.zod.js';

// Instance methods type
type PolicyMethodsType = {
  evaluate: (resourceType: string, action: string, subject: Subject) => boolean;
};

// Statics type
type PolicyStaticsType = {
  findByName: (name: string) => Promise<PolicyDocument | null>;
};

// Document type
export type PolicyDocument = Omit<PolicyType, '_id'> & Document<string> & PolicyMethodsType & { _id: string };

// Model type
export type PolicyModelType = Model<PolicyDocument> & PolicyStaticsType;

// Mongoose schema for Policy
export const PolicySchema = new Schema<PolicyDocument, PolicyModelType, PolicyMethodsType>(
  {
    _id: { type: String, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
    createdBy: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    description: { type: String },
    permissions: { type: Object, required: true }, // Use Object for structured data, validated by Zod
    globalConditions: { type: Object }, // Use Object for structured data, validated by Zod
  },
  {
    timestamps: true,
    methods: {
      evaluate(resourceType: string, action: string, subject: Subject): boolean {
        const policy = this.toObject() as PolicyType;
        return evaluatePolicy({
          policy,
          resourceType,
          action,
          subject,
        });
      },
    },
    statics: {
      async findByName(name: string) {
        return this.findOne({ name });
      },
    },
  }
);

// Validate with Zod before saving
PolicySchema.pre('save', function (next) {
  const parsed = PolicyTypeSchema.safeParse(this.toObject());
  if (!parsed.success) {
    return next(new Error('Policy validation failed: ' + JSON.stringify(parsed.error.format())));
  }
  next();
});
