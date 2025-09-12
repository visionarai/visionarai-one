import type { PersistedPolicy } from "./normalized-policy.types.js";

// EvaluationContext kept intentionally simple – caller is responsible for
// supplying already-materialized attribute bags. We use a type alias instead
// of interface per repo style guidelines.
export type EvaluationContext = {
	subject: Record<string, unknown>;
	resource: Record<string, unknown>;
	environment: Record<string, unknown>;
	resourceType: string;
	action: string;
};

const getFieldValue = (field: string, ctx: EvaluationContext): unknown => {
	const descend = (root: Record<string, unknown>, path: string) => {
		const parts = path.split(".");
		let current: unknown = root;
		for (const p of parts) {
			if (current && typeof current === "object" && p in (current as Record<string, unknown>)) {
				current = (current as Record<string, unknown>)[p];
			} else {
				return undefined as unknown;
			}
		}
		return current;
	};
	if (field.startsWith("subject.")) {
		return descend(ctx.subject, field.slice(8));
	}
	if (field.startsWith("resource.")) {
		return descend(ctx.resource, field.slice(9));
	}
	if (field.startsWith("environment.")) {
		return descend(ctx.environment, field.slice(12));
	}
	return undefined as unknown; // explicit for clarity
};

const cmp = {
	after: (a: unknown, b: unknown) => a instanceof Date && b instanceof Date && a > b,
	before: (a: unknown, b: unknown) => a instanceof Date && b instanceof Date && a < b,
	between: (a: unknown, s: unknown, e: unknown) => {
		if (a instanceof Date && s instanceof Date && e instanceof Date) {
			return a >= s && a <= e;
		}
		if (typeof a === "number" && typeof s === "number" && typeof e === "number") {
			return a >= s && a <= e;
		}
		return false;
	},
	contains: (a: unknown, b: unknown) => typeof a === "string" && typeof b === "string" && a.includes(b),
	endsWith: (a: unknown, b: unknown) => typeof a === "string" && typeof b === "string" && a.endsWith(b),
	equals: (a: unknown, b: unknown) => a === b,
	exists: (a: unknown) => a !== undefined && a !== null,
	greaterThan: (a: unknown, b: unknown) => typeof a === "number" && typeof b === "number" && a > b,
	greaterThanOrEqual: (a: unknown, b: unknown) => typeof a === "number" && typeof b === "number" && a >= b,
	in: (a: unknown, arr: unknown) => Array.isArray(arr) && arr.includes(a),
	isFalse: (a: unknown) => a === false,
	isTrue: (a: unknown) => a === true,
	lessThan: (a: unknown, b: unknown) => typeof a === "number" && typeof b === "number" && a < b,
	lessThanOrEqual: (a: unknown, b: unknown) => typeof a === "number" && typeof b === "number" && a <= b,
	notSet: (a: unknown) => a === undefined || a === null,
	on: (a: unknown, b: unknown) => a instanceof Date && b instanceof Date && a.getTime() === b.getTime(),
	startsWith: (a: unknown, b: unknown) => typeof a === "string" && typeof b === "string" && a.startsWith(b),
};

const evalNode = (nodeId: string, policy: PersistedPolicy, ctx: EvaluationContext, cache: Map<string, boolean>): boolean => {
	if (cache.has(nodeId)) {
		const cached = cache.get(nodeId);
		return Boolean(cached);
	}
	const node = policy.nodes[nodeId];
	if (!node) {
		return false;
	}
	let result = false;
	switch (node.kind) {
		case "scalar": {
			const val = getFieldValue(node.field, ctx);
			result = cmp[node.op](val, node.value);
			break;
		}
		case "set": {
			const val = getFieldValue(node.field, ctx);
			result = cmp.in(val, node.values);
			break;
		}
		case "unary": {
			const val = getFieldValue(node.field, ctx);
			result = cmp[node.op](val);
			break;
		}
		case "range": {
			const val = getFieldValue(node.field, ctx);
			result = cmp.between(val, node.start, node.end);
			break;
		}
		case "logical": {
			if (node.op === "and") {
				result = node.children.every((c) => evalNode(c, policy, ctx, cache));
			} else {
				result = node.children.some((c) => evalNode(c, policy, ctx, cache));
			}
			break;
		}
		case "not": {
			result = !evalNode(node.child, policy, ctx, cache);
			break;
		}
		default: {
			// Exhaustiveness guard – should be unreachable given discriminated union.
			result = false;
		}
	}
	cache.set(nodeId, result);
	return result;
};

export const evaluateNormalizedPolicy = (policy: PersistedPolicy, ctx: EvaluationContext): boolean => {
	const permissionSet = policy.permissions[ctx.resourceType];
	if (!permissionSet) {
		return false;
	}
	const decision = permissionSet[ctx.action];
	if (!decision) {
		return false;
	}
	if (policy.global?.root) {
		const globalOk = evalNode(policy.global.root, policy, ctx, new Map());
		if (!globalOk) {
			return false;
		}
	}
	switch (decision.type) {
		case "allow":
			return true;
		case "deny":
			return false;
		case "conditional":
			return evalNode(decision.root, policy, ctx, new Map());
		default:
			return false;
	}
};
