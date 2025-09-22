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

export type ConditionsType = {
	logic: (typeof CONDITIONS_LOGIC)[number];
	expressions: Array<ConditionNode | ConditionsType>;
};

export const ConditionsSchema: z.ZodType<ConditionsType> = z.lazy(() =>
	z.object({
		expressions: z.array(z.union([ConditionNodeSchema, ConditionsSchema])).min(1),
		logic: z.enum(CONDITIONS_LOGIC),
	})
);

export type ConditionsOutputType = z.output<typeof ConditionsSchema>;

export const BlankConditionalPermissionDecision: ConditionsOutputType = {
	expressions: [],
	logic: "AND",
} as const;

// export const PermissionSchema = z.object({
// 	conditions: ConditionsSchema,
// 	name: z.string().min(1, "Permission name is required"),
// });
// export type PermissionInputType = z.input<typeof PermissionSchema>;
// export type PermissionType = z.infer<typeof PermissionSchema>;

// export const permissionExample: PermissionType = {
// 	conditions: {
// 		conditions: [
// 			{
// 				field: { name: "id", scope: "user", type: "string" },
// 				operation: "equals",
// 				value: { cardinality: "one", scope: "literal", value: "userId" },
// 			},
// 			{
// 				conditions: [
// 					{
// 						field: { name: "currentWorkspace", scope: "user", type: "string" },
// 						operation: "in",
// 						value: { cardinality: "many", scope: "literal", values: ["tenant-1", "tenant-2"] },
// 					},
// 					{
// 						field: { name: "createdAt", scope: "resource", type: "Date" },
// 						operation: "after",
// 						value: { cardinality: "one", scope: "literal", value: new Date("2023-01-01") },
// 					},
// 				],
// 				logic: "OR",
// 			},
// 		],
// 		logic: "AND",
// 	},
// 	name: "Example Permission",
// };
