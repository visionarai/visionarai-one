// Legacy -> Normalized Policy Adapter (Experimental)
// Converts a legacy PolicyType (policy.zod.ts) into a normalized PersistedPolicy.
// Assumptions: legacy permissions values may be boolean or condition/group; we convert condition/group into a temporary tree.

import { randomUUID } from "node:crypto";
import type { ConditionNode, PermissionDecision, PersistedPolicy } from "./normalized-policy.types.js";
import type { Condition, ConditionGroup, PolicyType } from "./policy.zod.js";

// Generate a new node id (could be swapped later for ULIDs or deterministic hashing)
const newId = () => randomUUID();

// Convert a legacy Condition into one or more normalized nodes; returns root id(s) and node map additions
function convertLegacyCondition(cond: Condition): { root: string; nodes: Record<string, ConditionNode> } {
	// Heuristic: legacy condition may have arrays in value but no explicit operator differentiation.
	// If value is array => treat as set membership (in). Otherwise scalar equals variant.
	if (Array.isArray(cond.value)) {
		const id = newId();
		const values = cond.value as (string | number | boolean | Date)[];
		return {
			nodes: {
				[id]: { field: cond.field, id, kind: "set", op: "in", values },
			},
			root: id,
		};
	}
	// Map some legacy operations to normalized categories
	const scalarId = newId();
	const opMap: Record<string, string> = {
		after: "after",
		before: "before",
		between: "between",
		contains: "contains",
		endsWith: "endsWith",
		equals: "equals",
		exists: "exists",
		greaterThan: "greaterThan",
		greaterThanOrEqual: "greaterThanOrEqual",
		in: "in",
		isFalse: "isFalse",
		isTrue: "isTrue",
		lessThan: "lessThan",
		lessThanOrEqual: "lessThanOrEqual",
		notSet: "notSet",
		on: "on",
		startsWith: "startsWith",
	};
	const normative = opMap[cond.operation] ?? "equals";
	if (normative === "exists" || normative === "isTrue" || normative === "isFalse" || normative === "notSet") {
		return {
			nodes: {
				[scalarId]: {
					field: cond.field,
					id: scalarId,
					kind: "unary",
					op: normative as "exists" | "isTrue" | "isFalse" | "notSet",
				},
			},
			root: scalarId,
		};
	}
	// between unsupported in legacy Condition shape (needs two values); treat as scalar equals fallback
	return {
		nodes: {
			[scalarId]: {
				field: cond.field,
				id: scalarId,
				kind: "scalar",
				op: normative as
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
					| "on",
				value: cond.value as string | number | boolean | Date,
			},
		},
		root: scalarId,
	};
}

function convertLegacyConditionNode(node: Condition | ConditionGroup): { root: string; nodes: Record<string, ConditionNode> } {
	if ("field" in node) {
		return convertLegacyCondition(node);
	}
	if (node.operator === "NOT") {
		const inner = convertLegacyConditionNode(node.conditions as Condition | ConditionGroup);
		const id = newId();
		return {
			nodes: { ...inner.nodes, [id]: { child: inner.root, id, kind: "not" } },
			root: id,
		};
	}
	// AND / OR -> logical
	const childRoots: string[] = [];
	let aggregate: Record<string, ConditionNode> = {};
	for (const c of node.conditions as Array<Condition | ConditionGroup>) {
		const converted = convertLegacyConditionNode(c);
		childRoots.push(converted.root);
		aggregate = { ...aggregate, ...converted.nodes };
	}
	const id = newId();
	aggregate[id] = { children: childRoots, id, kind: "logical", op: node.operator === "AND" ? "and" : "or" };
	return { nodes: aggregate, root: id };
}

export function legacyPolicyToNormalized(legacy: PolicyType, actor: { updatedBy: string }): PersistedPolicy {
	const nodes: Record<string, ConditionNode> = {};
	let globalRoot: string | null = null;
	if (legacy.globalConditions) {
		const converted = convertLegacyConditionNode(legacy.globalConditions as Condition | ConditionGroup);
		Object.assign(nodes, converted.nodes);
		globalRoot = converted.root;
	}

	const permissions: Record<string, Record<string, PermissionDecision>> = {};
	for (const [resourceType, actions] of Object.entries(legacy.permissions)) {
		permissions[resourceType] = {};
		for (const [action, decision] of Object.entries(actions)) {
			if (typeof decision === "boolean") {
				permissions[resourceType][action] = { type: decision ? "allow" : "deny" };
			} else {
				const converted = convertLegacyConditionNode(decision as Condition | ConditionGroup);
				Object.assign(nodes, converted.nodes);
				permissions[resourceType][action] = { root: converted.root, type: "conditional" };
			}
		}
	}

	const now = new Date();
	const normalized: PersistedPolicy = {
		_id: legacy._id || "",
		createdAt: legacy.createdAt || now,
		createdBy: legacy.createdBy || actor.updatedBy,
		description: legacy.description,
		global: { root: globalRoot },
		name: legacy.name,
		nodes,
		permissions,
		updatedAt: now,
		updatedBy: actor.updatedBy,
		version: 0,
	};
	return normalized;
}
