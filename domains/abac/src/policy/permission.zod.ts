import { z } from "zod";
import { ExpressionGroupSchema, SCOPE_TYPE_ATTRIBUTE_MAP } from "./condition.zod";

export const PermissionDecisionSchema = z.discriminatedUnion("decision", [
	z.object({ decision: z.literal("ALLOW") }),
	z.object({ decision: z.literal("DENY") }),
	z.object({ condition: ExpressionGroupSchema, decision: z.literal("CONDITIONAL") }),
]);

export type PermissionType = z.infer<typeof PermissionDecisionSchema>;
export type PermissionInputType = z.input<typeof PermissionDecisionSchema>;
/**
 * Stable list of permission decision types.
 */
export const PERMISSION_DECISION_TYPES = ["ALLOW", "DENY", "CONDITIONAL"] as const;
/**
 * Convenience alias for decision type literals; mirrors PERMISSION_DECISION_TYPES.
 */
export type PermissionTypes = (typeof PERMISSION_DECISION_TYPES)[number];

export const EvaluationContext = {
	...SCOPE_TYPE_ATTRIBUTE_MAP,
	action: "subject",
};
