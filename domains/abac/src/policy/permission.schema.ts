import { z } from "zod";
import { ConditionsSchema } from "./condition.schema";

export const PermissionDecisionSchema = z.discriminatedUnion("type", [
	z.object({ type: z.literal("ALLOW") }),
	z.object({ type: z.literal("DENY") }),
	z.object({ condition: ConditionsSchema, type: z.literal("CONDITIONAL") }),
]);

export type PermissionDecision = z.infer<typeof PermissionDecisionSchema>;
export const PERMISSION_DECISION_TYPES = ["ALLOW", "DENY", "CONDITIONAL"] as const;
export const permissionTypes = PermissionDecisionSchema.options.map((schema) => schema.shape.type.value);
