import z from "zod";
import type { ResourceType } from "../master_data/master-data.zod";
import { PermissionDecisionSchema, type PermissionType } from "./permission.zod";

export const PersistedPolicySchema = z.object({
	_id: z.string().min(1),
	createdAt: z.date(),
	createdBy: z.string().min(1),
	description: z.string().optional(),
	name: z.string().min(1),
	permissions: z.record(z.string(), z.record(z.string(), PermissionDecisionSchema)),
	updatedAt: z.date(),
	version: z.number().int().nonnegative(),
});

export type PersistedPolicy = z.infer<typeof PersistedPolicySchema>;

export const CreateNewPolicyInputSchema = z.object({
	createdBy: z.string().min(1),
	description: z.string().optional(),
	name: z.string().min(1),
});
export type CreateNewPolicyInput = z.infer<typeof CreateNewPolicyInputSchema>;

export const UpdatePolicyInputSchema = PersistedPolicySchema.partial().omit({ _id: true, createdAt: true, createdBy: true, updatedAt: true, version: true });
export type UpdatePolicyInput = z.infer<typeof UpdatePolicyInputSchema>;

export type NewPolicy = Omit<PersistedPolicy, "_id" | "createdAt" | "updatedAt">;
export const createPlaceholderPolicy = ({ name, description, createdBy }: CreateNewPolicyInput, resources: ResourceType[]): NewPolicy => ({
	createdBy,
	description,
	name,
	permissions: resources.reduce(
		(acc, resource) => {
			if (!(resource.name && resource.permissions)) {
				return acc;
			}
			acc[resource.name] = resource.permissions.reduce(
				(permAcc, permission) => {
					if (permission) {
						permAcc[permission] = { decision: "DENY" } as PermissionType;
					}
					return permAcc;
				},
				{} as Record<string, PermissionType>
			);

			return acc;
		},
		{} as PersistedPolicy["permissions"]
	),
	version: 1,
});

export const examplePolicy: PersistedPolicy = {
	_id: "policyId",
	createdAt: new Date(),
	createdBy: "userId",
	description: "An example policy",
	name: "Example Policy",
	permissions: {
		documents: {
			delete: { decision: "DENY" },
			read: { decision: "ALLOW" },
			write: {
				condition: {
					expressions: [
						{
							field: { name: "id", scope: "user", type: "string" },
							operation: "equals",
							value: { cardinality: "one", scope: "literal", value: "userId" },
						},
						{
							expressions: [
								{
									field: { name: "currentWorkspace", scope: "user", type: "string" },
									operation: "in",
									value: { cardinality: "many", scope: "literal", values: ["tenant-1", "tenant-2"] },
								},
								{
									field: { name: "createdAt", scope: "resource", type: "Date" },
									operation: "after",
									value: { cardinality: "one", name: "timeOfDay", scope: "environment", value: new Date("2024-01-01") },
								},
							],
							logic: "OR",
						},
					],
					logic: "AND",
				},
				decision: "CONDITIONAL",
			},
		},
		users: {
			invite: { decision: "DENY" },
			read: { decision: "ALLOW" },
		},
	},
	updatedAt: new Date(),
	version: 1,
};
