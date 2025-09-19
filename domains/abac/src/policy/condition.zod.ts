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

export const ConditionNodeSchema = z.object({
	field: FieldTypeSchema,
	operation: z.string(),
	value: ValueTypeSchema,
});
export type ConditionNode = z.infer<typeof ConditionNodeSchema>;

export const CONDITIONS_LOGIC = ["AND", "OR", "NOT"] as const;

export type ConditionsType = {
	logic: (typeof CONDITIONS_LOGIC)[number];
	conditions: Array<ConditionNode | ConditionsType>;
};
// | {
// 		logic: "NONE";
// 		condition: ConditionNode;
//   };

export const ConditionsSchema: z.ZodType<ConditionsType> = z.lazy(() =>
	z.object({
		conditions: z.array(z.union([ConditionNodeSchema, ConditionsSchema])).min(1),
		logic: z.enum(CONDITIONS_LOGIC),
	})
);

export type ConditionsInputType = z.input<typeof ConditionsSchema>;

// export const CONDITIONS_LOGIC = ["AND", "OR", "NOT", "NONE"] as const;

export const exampleCondition: ConditionNode = {
	field: { name: "currentWorkspace", scope: "user", type: "string" },
	operation: "equals",
	value: { cardinality: "one", name: "workspaceId", scope: "resource", value: "" },
};

// export const conditionExample: ConditionsType = {
// 	condition: {
// 		field: { name: "id", scope: "user", type: "string" },
// 		operation: "equals",
// 		value: { cardinality: "one", scope: "literal", value: "user-123" },
// 	},

// 	logic: "NONE",
// };

export const conditionExample: ConditionsType = {
	conditions: [
		{
			field: { name: "id", scope: "user", type: "string" },
			operation: "equals",
			value: { cardinality: "one", scope: "literal", value: "user-123" },
		},
		{
			field: { name: "currentWorkspace", scope: "user", type: "string" },
			operation: "equals",
			value: { cardinality: "one", name: "workspaceId", scope: "resource", value: "workspace-456" },
		},
		{
			conditions: [
				{
					field: { name: "ip", scope: "environment", type: "string" },
					operation: "startsWith",
					value: { cardinality: "one", scope: "literal", value: "192.168." },
				},
				{
					field: { name: "location", scope: "environment", type: "string" },
					operation: "equals",
					value: { cardinality: "one", scope: "literal", value: "USA" },
				},
			],
			logic: "OR",
		},
	],
	logic: "AND",
};

export const PermissionSchema = z.object({
	conditions: ConditionsSchema,
	name: z.string().min(1, "Permission name is required"),
});
export type PermissionInputType = z.input<typeof PermissionSchema>;
export type PermissionType = z.infer<typeof PermissionSchema>;

export const permissionExample: PermissionType = {
	conditions: {
		conditions: [
			{
				field: { name: "id", scope: "user", type: "string" },
				operation: "equals",
				value: { cardinality: "one", scope: "literal", value: "user-123" },
			},
			{
				field: { name: "currentWorkspace", scope: "user", type: "string" },
				operation: "equals",
				value: { cardinality: "one", name: "workspaceId", scope: "resource", value: "workspace-456" },
			},
			{
				conditions: [
					{
						field: { name: "ip", scope: "environment", type: "string" },
						operation: "startsWith",
						value: { cardinality: "one", scope: "literal", value: "192.168." },
					},
					{
						field: { name: "location", scope: "environment", type: "string" },
						operation: "equals",
						value: { cardinality: "one", scope: "literal", value: "USA" },
					},
				],
				logic: "OR",
			},
		],
		logic: "AND",
	},
	name: "Example Permission",
};
