import { z } from "zod";
import type { ConditionNode, PermissionDecision } from "./normalized-policy.types.js";
import { OPERATOR_SPEC } from "./operator-spec.js";

// Primitive scalar schema (Date handled separately)
const scalarPrimitive = z.union([z.string(), z.number(), z.boolean(), z.date()]);

// Helper enums derived from operator spec
const scalarOps = z.enum([
	"equals",
	"contains",
	"startsWith",
	"endsWith",
	"greaterThan",
	"lessThan",
	"greaterThanOrEqual",
	"lessThanOrEqual",
	"before",
	"after",
	"on",
]);
const setOps = z.enum(["in"]);
const unaryOps = z.enum(["exists", "notSet", "isTrue", "isFalse"]);
const rangeOps = z.enum(["between"]);

// Node schemas
export const ScalarNodeSchema = z.object({
	field: z.string().min(1),
	id: z.string().min(1),
	kind: z.literal("scalar"),
	op: scalarOps,
	value: scalarPrimitive,
});

export const SetNodeSchema = z.object({
	field: z.string().min(1),
	id: z.string().min(1),
	kind: z.literal("set"),
	op: setOps,
	values: z.array(scalarPrimitive).min(1),
});

export const UnaryNodeSchema = z.object({
	field: z.string().min(1),
	id: z.string().min(1),
	kind: z.literal("unary"),
	op: unaryOps,
});

export const RangeNodeSchema = z.object({
	end: scalarPrimitive,
	field: z.string().min(1),
	id: z.string().min(1),
	kind: z.literal("range"),
	op: rangeOps,
	start: scalarPrimitive,
});

export const LogicalNodeSchema = z.object({
	children: z.array(z.string().min(1)).min(2),
	id: z.string().min(1),
	kind: z.literal("logical"),
	op: z.enum(["and", "or"]),
});

export const NotNodeSchema = z.object({
	child: z.string().min(1),
	id: z.string().min(1),
	kind: z.literal("not"),
});

export const ConditionNodeSchema: z.ZodType<ConditionNode> = z.union([
	ScalarNodeSchema,
	SetNodeSchema,
	UnaryNodeSchema,
	RangeNodeSchema,
	LogicalNodeSchema,
	NotNodeSchema,
]);

export const PermissionDecisionSchema: z.ZodType<PermissionDecision> = z.union([
	z.object({ type: z.literal("allow") }),
	z.object({ type: z.literal("deny") }),
	z.object({ root: z.string().min(1), type: z.literal("conditional") }),
]);

export const PersistedPolicySchema = z.object({
	_id: z.string().min(1),
	createdAt: z.date(),
	createdBy: z.string().min(1),
	description: z.string().optional(),
	global: z.object({ root: z.string().min(1).nullable() }).optional(),
	name: z.string().min(1),
	nodes: z.record(z.string(), ConditionNodeSchema),
	permissions: z.record(z.string(), z.record(z.string(), PermissionDecisionSchema)),
	updatedAt: z.date(),
	updatedBy: z.string().min(1),
	version: z.number().int().nonnegative(),
});

export type NormalizedPolicy = z.infer<typeof PersistedPolicySchema>;

// Basic structural + operator spec consistency refinement (field type compatibility deferred to semantic validator)
export const basicNormalizedPolicyCheck = (policy: unknown) => {
	const parsed = PersistedPolicySchema.safeParse(policy);
	if (!parsed.success) {
		return parsed;
	}
	for (const node of Object.values(parsed.data.nodes)) {
		if ((node.kind === "scalar" || node.kind === "set" || node.kind === "unary" || node.kind === "range") && !(node.op in OPERATOR_SPEC)) {
			return { error: new Error(`Unknown operator in node ${node.id}: ${node.op}`), success: false as const };
		}
	}
	return parsed;
};

export const examplePolicy: NormalizedPolicy = {
	_id: "policy123",
	createdAt: new Date(),
	createdBy: "admin",
	description: "An example normalized policy",
	global: { root: null },
	name: "Example Policy",
	nodes: {
		node1: { field: "user.role", id: "node1", kind: "scalar", op: "equals", value: "admin" },
		node2: { field: "resource.tags", id: "node2", kind: "set", op: "in", values: ["public", "internal"] },
		node3: { children: ["node1", "node2"], id: "node3", kind: "logical", op: "and" },
	},
	permissions: {
		document: {
			read: { root: "node3", type: "conditional" },
			write: { type: "deny" },
		},
	},
	updatedAt: new Date(),
	updatedBy: "admin",
	version: 1,
};

// Example usage of the schema validation
