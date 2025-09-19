import { z } from "zod";
import { ConditionNodeSchema } from "./condition.zod";

export const PermissionDecisionSchema = z.discriminatedUnion("type", [
	z.object({ type: z.literal("allow") }),
	z.object({ type: z.literal("deny") }),
	z.object({ condition: ConditionNodeSchema, type: z.literal("conditional") }),
]);

export type PermissionDecision = z.infer<typeof PermissionDecisionSchema>;
export const PERMISSION_DECISION_TYPES = ["allow", "deny", "conditional"] as const;
export const permissionTypes = PermissionDecisionSchema.options.map((schema) => schema.shape.type.value);
