import { z } from "zod";
import { SCALAR_VALUE_TYPES, type ScalarValueType } from "./operation.specs";

export * from "./operation.specs";

const ScalarPrimitiveSchema = z.union([z.string(), z.number(), z.boolean(), z.date()]);

export const FIELD_SCOPE_KINDS = ["resource", "environment", "user"] as const;
export const VALUE_SCOPE_KINDS = ["literal", ...FIELD_SCOPE_KINDS] as const;

const ENVIRONMENT_ATTRIBUTES = ["ip", "location", "timeOfDay", "total", "weather", "dangerous"] as const;
const USER_ATTRIBUTES = ["currentWorkspace", "id"] as const;

export type ScopeTypeAttributeMap = {
	environment: Record<(typeof ENVIRONMENT_ATTRIBUTES)[number], ScalarValueType>;
	resource: Record<string, ScalarValueType>;
	user: Record<(typeof USER_ATTRIBUTES)[number], ScalarValueType>;
};

export const SCOPE_TYPE_ATTRIBUTE_MAP: ScopeTypeAttributeMap = {
	environment: {
		dangerous: "boolean",
		ip: "string",
		location: "string",
		timeOfDay: "Date",
		total: "number",
		weather: "string",
	},
	resource: {
		workspaceId: "string",
	},
	user: {
		currentWorkspace: "string",
		id: "string",
	},
} as const;

export const ValueTypeCardinalitySchema = z.discriminatedUnion("cardinality", [
	z.object({ cardinality: z.literal("none") }),
	z.object({ cardinality: z.literal("one"), value: ScalarPrimitiveSchema }),
	z.object({ cardinality: z.literal("many"), values: z.array(ScalarPrimitiveSchema).min(1) }),
	z.object({ cardinality: z.literal("range"), end: ScalarPrimitiveSchema, start: ScalarPrimitiveSchema }),
]);

export const ValueScopeSchema = z.discriminatedUnion("scope", [
	z.object({ scope: z.literal("literal") }),
	z.object({ name: z.enum(USER_ATTRIBUTES), scope: z.literal("user") }),
	z.object({ name: z.enum(ENVIRONMENT_ATTRIBUTES), scope: z.literal("environment") }),
	z.object({ name: z.string().min(1), scope: z.literal("resource") }),
]);

export const FieldScopeSchema = z.discriminatedUnion("scope", [
	z.object({ name: z.enum(USER_ATTRIBUTES), scope: z.literal("user") }),
	z.object({ name: z.enum(ENVIRONMENT_ATTRIBUTES), scope: z.literal("environment") }),
	z.object({ name: z.string().min(1), scope: z.literal("resource") }),
]);

export const FieldTypeSchema = z
	.object({
		type: z.enum(SCALAR_VALUE_TYPES),
	})
	.and(FieldScopeSchema);

export const ValueTypeSchema = ValueScopeSchema.and(ValueTypeCardinalitySchema);

export type ValueType = z.infer<typeof ValueTypeSchema>;

export const ConditionNodeSchema = z.object({
	field: FieldTypeSchema,
	operation: z.string(),
	value: ValueTypeSchema,
});
export type ConditionNode = z.infer<typeof ConditionNodeSchema>;

export const CONDITIONS_LOGIC = ["AND", "OR", "NOT"] as const;

export type ConditionLogicType = (typeof CONDITIONS_LOGIC)[number];

export type ConditionsType = {
	logic: ConditionLogicType;
	expressions: Array<ConditionNode | ConditionsType>;
};

export const ConditionsSchema: z.ZodType<ConditionsType> = z.lazy(() =>
	z.object({
		expressions: z.array(z.union([ConditionNodeSchema, ConditionsSchema])).min(1),
		logic: z.enum(CONDITIONS_LOGIC),
	})
);

export const BlankConditionalPermissionDecision: ConditionsType = {
	expressions: [],
	logic: "AND",
} as const;
