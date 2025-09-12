import type { ConditionNode, FieldDescriptor, PersistedPolicy } from "./normalized-policy.types.js";
import { PersistedPolicySchema } from "./normalized-policy.zod.js";
import { OPERATOR_SPEC } from "./operator-spec.js";

export type SemanticValidationIssue = {
	code: string;
	message: string;
	nodeId?: string;
	path?: string;
};

export type SemanticValidationResult = {
	ok: boolean;
	issues: SemanticValidationIssue[];
};

export type SemanticValidatorConfig = {
	fieldRegistry: FieldDescriptor[]; // Provided from master data + subject/environment sets
	maxDepth?: number;
	maxNodes?: number;
};

const fieldMapFromRegistry = (registry: FieldDescriptor[]): Record<string, FieldDescriptor> => {
	return registry.reduce<Record<string, FieldDescriptor>>((acc, f) => {
		acc[f.id] = f;
		return acc;
	}, {});
};

// Helper: operator field compatibility
const validateOperatorCompatibility = (
	node: Extract<ConditionNode, { kind: "scalar" | "set" | "unary" | "range" }>,
	fieldType: FieldDescriptor["valueType"],
	issues: SemanticValidationIssue[]
) => {
	const spec = OPERATOR_SPEC[node.op];
	if (!spec) {
		issues.push({ code: "OP_UNKNOWN", message: `Operator ${node.op} not recognized`, nodeId: node.id });
		return;
	}
	if (!spec.valueTypes.includes(fieldType)) {
		issues.push({ code: "OP_FIELD_TYPE_MISMATCH", message: `Operator ${spec.name} not allowed on field type ${fieldType}`, nodeId: node.id });
	}
};

const collectCandidateRoots = (p: PersistedPolicy): string[] => {
	const roots: string[] = [];
	if (p.global?.root) {
		roots.push(p.global.root);
	}
	for (const resource of Object.values(p.permissions)) {
		for (const decision of Object.values(resource)) {
			if (decision.type === "conditional") {
				roots.push(decision.root);
			}
		}
	}
	return roots;
};

type StructuralContext = {
	policy: PersistedPolicy;
	fieldMap: Record<string, FieldDescriptor>;
	issues: SemanticValidationIssue[];
	parentCount: Record<string, number>;
};

const recordParent = (id: string, parentCount: Record<string, number>) => {
	parentCount[id] = (parentCount[id] || 0) + 1;
};

const handleLogicalNode = (node: Extract<ConditionNode, { kind: "logical" }>, ctx: StructuralContext) => {
	if (node.children.length < 2) {
		ctx.issues.push({ code: "LOGICAL_CHILDREN_MIN", message: `Logical node ${node.id} must have at least 2 children`, nodeId: node.id });
	}
	for (const child of node.children) {
		recordParent(child, ctx.parentCount);
	}
};

const handleNotNode = (node: Extract<ConditionNode, { kind: "not" }>, ctx: StructuralContext) => {
	recordParent(node.child, ctx.parentCount);
};

const handleSetNode = (node: Extract<ConditionNode, { kind: "set" }>, ctx: StructuralContext) => {
	if (node.values.length === 0) {
		ctx.issues.push({ code: "SET_EMPTY", message: `Set node ${node.id} must have values`, nodeId: node.id });
	}
};

const handleRangeNode = (node: Extract<ConditionNode, { kind: "range" }>, ctx: StructuralContext) => {
	if (node.start instanceof Date && node.end instanceof Date && node.start > node.end) {
		ctx.issues.push({ code: "RANGE_ORDER", message: `Range node ${node.id} start > end`, nodeId: node.id });
	}
	if (typeof node.start === "number" && typeof node.end === "number" && node.start > node.end) {
		ctx.issues.push({ code: "RANGE_ORDER", message: `Range node ${node.id} start > end`, nodeId: node.id });
	}
};

const validateFieldAndOperator = (node: ConditionNode, ctx: StructuralContext) => {
	if (!("field" in node)) {
		return;
	}
	const fd = ctx.fieldMap[node.field];
	if (!fd) {
		ctx.issues.push({ code: "FIELD_UNKNOWN", message: `Field ${node.field} not in registry`, nodeId: node.id });
		return;
	}
	if (node.kind === "scalar" || node.kind === "set" || node.kind === "unary" || node.kind === "range") {
		validateOperatorCompatibility(node, fd.valueType, ctx.issues);
	}
};

const validateSingleNode = (node: ConditionNode, ctx: StructuralContext) => {
	switch (node.kind) {
		case "logical":
			handleLogicalNode(node, ctx);
			break;
		case "not":
			handleNotNode(node, ctx);
			break;
		case "set":
			handleSetNode(node, ctx);
			break;
		case "range":
			handleRangeNode(node, ctx);
			break;
		default:
			break;
	}
	validateFieldAndOperator(node, ctx);
};

const validateNodesStructural = (ctx: StructuralContext) => {
	for (const node of Object.values(ctx.policy.nodes)) {
		validateSingleNode(node, ctx);
	}
};

type DepthContext = {
	policy: PersistedPolicy;
	roots: string[];
	maxDepth: number;
	issues: SemanticValidationIssue[];
	parentCount: Record<string, number>;
};

const performDepthChecks = (ctx: DepthContext) => {
	const depthCache: Record<string, number> = {};
	const visitDepth = (id: string, stack: string[]): number => {
		if (stack.includes(id)) {
			ctx.issues.push({ code: "CYCLE", message: `Cycle detected at node ${id}`, nodeId: id });
			return 0;
		}
		const node = ctx.policy.nodes[id];
		if (!node) {
			ctx.issues.push({ code: "MISSING_NODE", message: `Referenced node ${id} not found` });
			return 0;
		}
		if (depthCache[id] !== undefined) {
			return depthCache[id];
		}
		let depth = 1;
		if (node.kind === "logical") {
			depth = 1 + Math.max(...node.children.map((child) => visitDepth(child, [...stack, id])));
		} else if (node.kind === "not") {
			depth = 1 + visitDepth(node.child, [...stack, id]);
		}
		depthCache[id] = depth;
		return depth;
	};
	for (const root of ctx.roots) {
		const d = visitDepth(root, []);
		if (d > ctx.maxDepth) {
			ctx.issues.push({ code: "DEPTH_EXCEEDED", message: `Depth ${d} exceeds limit ${ctx.maxDepth} at root ${root}`, nodeId: root });
		}
	}
	for (const [nodeId, count] of Object.entries(ctx.parentCount)) {
		if (count > 1) {
			ctx.issues.push({ code: "TREE_VIOLATION", message: `Node ${nodeId} referenced by multiple parents`, nodeId });
		}
	}
};

export const validateNormalizedPolicy = (policy: unknown, cfg: SemanticValidatorConfig): SemanticValidationResult => {
	const basic = PersistedPolicySchema.safeParse(policy);
	if (!basic.success) {
		return { issues: [{ code: "SCHEMA_INVALID", message: basic.error.message }], ok: false };
	}
	const p: PersistedPolicy = basic.data;
	const issues: SemanticValidationIssue[] = [];
	const fieldMap = fieldMapFromRegistry(cfg.fieldRegistry);
	const maxDepth = cfg.maxDepth ?? 25;
	const maxNodes = cfg.maxNodes ?? 500;

	const nodeEntries = Object.entries(p.nodes);
	if (nodeEntries.length > maxNodes) {
		issues.push({ code: "NODE_LIMIT_EXCEEDED", message: `Node count ${nodeEntries.length} exceeds limit ${maxNodes}` });
	}

	// Track parent references to enforce tree structure
	const parentCount: Record<string, number> = {};

	// Collect roots: global root + conditional permission roots
	const candidateRoots = collectCandidateRoots(p);

	// Validate referenced roots exist
	for (const rootId of candidateRoots) {
		if (!p.nodes[rootId]) {
			issues.push({ code: "ROOT_MISSING", message: `Root node ${rootId} not found` });
		}
	}

	// Parent counting & field/operator checks
	validateNodesStructural({ fieldMap, issues, parentCount, policy: p });

	performDepthChecks({ issues, maxDepth, parentCount, policy: p, roots: candidateRoots });

	return { issues, ok: issues.length === 0 };
};
