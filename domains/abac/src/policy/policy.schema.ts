import { z } from "zod";
import { PermissionDecisionSchema } from "./permission.schema";

export const PersistedPolicySchema = z.object({
	_id: z.string().min(1),
	createdAt: z.date(),
	createdBy: z.string().min(1),
	description: z.string().optional(),
	name: z.string().min(1),
	permissions: z.record(z.string(), z.record(z.string(), PermissionDecisionSchema)),
	updatedAt: z.date(),
	updatedBy: z.string().min(1),
	version: z.number().int().nonnegative(),
});

export type PersistedPolicy = z.infer<typeof PersistedPolicySchema>;

export const examplePolicy: PersistedPolicy = {
	_id: "policyId",
	createdAt: new Date(),
	createdBy: "userId",
	description: "An example policy",
	name: "Example Policy",
	permissions: {
		document: {
			delete: { type: "DENY" },
			read: { type: "ALLOW" },
			write: {
				condition: {
					conditions: [
						{
							field: { name: "id", scope: "user", type: "string" },
							operation: "equals",
							value: { cardinality: "one", scope: "literal", value: "userId" },
						},
						{
							conditions: [
								{
									field: { name: "currentWorkspace", scope: "user", type: "string" },
									operation: "in",
									value: { cardinality: "many", scope: "literal", values: ["tenant-1", "tenant-2"] },
								},
								{
									field: { name: "createdAt", scope: "resource", type: "Date" },
									operation: "after",
									value: { cardinality: "one", scope: "literal", value: new Date("2023-01-01") },
								},
							],
							logic: "OR",
						},
					],
					logic: "AND",
				},
				type: "CONDITIONAL",
			},
		},
	},
	updatedAt: new Date(),
	updatedBy: "userId",
	version: 1,
};
