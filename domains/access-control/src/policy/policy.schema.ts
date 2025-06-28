import { Model, Schema } from 'mongoose';
import { type PolicyType } from './policy.types.js';

type PolicyModelType = Model<PolicyType> & {
  myStaticMethod(): number;
};

type PolicyMethodsType = {
  isActionAllowedForResource(resourceType: string, action: string): boolean;
};

export const PolicySchema = new Schema<PolicyType, PolicyModelType, PolicyMethodsType>(
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
  {
    timestamps: true,

    methods: {
      isActionAllowedForResource(resourceType: string, action: string): boolean {
        const permissionsForResource = this.permissions[resourceType];
        if (!permissionsForResource) {
          return false; // No permissions defined for this resource type
        }
        if (!permissionsForResource[action]) {
          return false; // No permission defined for this action
        }
        const actionPermission = permissionsForResource[action];

        // Check if the action permission is a boolean
        if (typeof actionPermission === 'boolean') {
          return actionPermission; // Direct boolean permission
        }

        // Check if the action permission is a condition
        if (typeof actionPermission === 'object' && 'field' in actionPermission) {
          // Here you would implement the logic to evaluate the condition against the subject
          // For now, we return true as a placeholder
          return true; // Placeholder for condition evaluation logic
        }
        // If we reach here, it means the action permission is neither a boolean nor a condition
        return false; // Default case if no conditions match
      },
    },
  }
);
