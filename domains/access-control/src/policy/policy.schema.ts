import { Schema } from 'mongoose';
import { type PolicyType } from './policy.types.js';

export const PolicySchema = new Schema<PolicyType>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    permissions: {
      type: Map,
      of: new Schema({
        actions: {
          type: Map,
          of: {
            type: Schema.Types.Mixed, // Can be boolean or condition/group
          },
        },
      }),
    },
    globalConditions: {
      type: Schema.Types.Mixed, // Can be a single condition or a group
    },
  },
  { timestamps: true }
);

// const PolicyModel = (models.Policy as Model<PolicyType>) || model<PolicyType>('Policy', PolicySchema);

// export default PolicyModel as unknown as Model<PolicyType>;
