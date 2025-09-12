// Normalized Policy Domain Types (Experimental)
// --------------------------------------------------
// These types represent the new normalized policy model.
// They coexist with the legacy PolicyType until migration completes.

export type Scalar = string | number | boolean | Date;

// Condition Node Variants (strict tree — no shared nodes)
export type ScalarOp =
	| "equals"
	| "contains"
	| "startsWith"
	| "endsWith"
	| "greaterThan"
	| "lessThan"
	| "greaterThanOrEqual"
	| "lessThanOrEqual"
	| "before"
	| "after"
	| "on";

export type SetOp = "in";
export type UnaryOp = "exists" | "notSet" | "isTrue" | "isFalse";
export type RangeOp = "between";

export type ConditionNode =
	| { id: string; kind: "scalar"; field: string; op: ScalarOp; value: Scalar }
	| { id: string; kind: "set"; field: string; op: SetOp; values: Scalar[] }
	| { id: string; kind: "unary"; field: string; op: UnaryOp }
	| { id: string; kind: "range"; field: string; op: RangeOp; start: Scalar; end: Scalar }
	| { id: string; kind: "logical"; op: "and" | "or"; children: string[] }
	| { id: string; kind: "not"; child: string };

export type PermissionDecision = { type: "allow" } | { type: "deny" } | { type: "conditional"; root: string };

export type PersistedPolicy = {
	_id: string;
	name: string;
	description?: string;
	version: number; // optimistic concurrency
	createdAt: Date;
	updatedAt: Date;
	createdBy: string;
	updatedBy: string;
	global?: { root: string | null };
	nodes: Record<string, ConditionNode>;
	permissions: Record<string, Record<string, PermissionDecision>>; // resource -> action -> decision
};

export type CreatePolicyInput = Omit<PersistedPolicy, "_id" | "version" | "createdAt" | "updatedAt" | "updatedBy"> & { createdBy: string };

export type PolicyPatchOp =
	| { kind: "updateMetadata"; name?: string; description?: string }
	| { kind: "setGlobalRoot"; root: string | null }
	| { kind: "addNode"; node: ConditionNode }
	| { kind: "updateNode"; nodeId: string; patch: Partial<ConditionNode> }
	| { kind: "removeNode"; nodeId: string }
	| { kind: "relinkLogical"; nodeId: string; children: string[] }
	| { kind: "setPermissionDecision"; resource: string; action: string; decision: PermissionDecision };

export type UpdatePolicyPatch = {
	policyId: string;
	expectedVersion: number;
	ops: PolicyPatchOp[];
	updatedBy: string;
};

export type FieldDescriptor = {
	id: string; // e.g. subject._id, resource.visibility
	scope: "subject" | "resource" | "environment";
	valueType: "string" | "number" | "boolean" | "Date";
};

export type OperatorSpecEntry = {
	name: string;
	category: "scalar" | "set" | "unary" | "range";
	valueTypes: FieldDescriptor["valueType"][]; // allowed field value types
	cardinality: "none" | "one" | "many" | "range";
};

export type OperatorSpecMap = Record<string, OperatorSpecEntry>;
