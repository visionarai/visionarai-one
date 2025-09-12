import type { OperatorSpecMap } from "./normalized-policy.types.js";

// Operator specification without regex (deferred) and with explicit cardinality + allowed value types.
export const OPERATOR_SPEC: OperatorSpecMap = {
	after: { cardinality: "one", category: "scalar", name: "after", valueTypes: ["Date"] },
	before: { cardinality: "one", category: "scalar", name: "before", valueTypes: ["Date"] },
	// Ranges
	between: { cardinality: "range", category: "range", name: "between", valueTypes: ["Date", "number"] },
	contains: { cardinality: "one", category: "scalar", name: "contains", valueTypes: ["string"] },
	endsWith: { cardinality: "one", category: "scalar", name: "endsWith", valueTypes: ["string"] },
	// Universal scalar comparisons
	equals: { cardinality: "one", category: "scalar", name: "equals", valueTypes: ["string", "number", "boolean", "Date"] },
	// Unary predicates
	exists: { cardinality: "none", category: "unary", name: "exists", valueTypes: ["string", "number", "boolean", "Date"] },
	greaterThan: { cardinality: "one", category: "scalar", name: "greaterThan", valueTypes: ["number"] },
	greaterThanOrEqual: { cardinality: "one", category: "scalar", name: "greaterThanOrEqual", valueTypes: ["number"] },
	// Set membership
	in: { cardinality: "many", category: "set", name: "in", valueTypes: ["string", "number", "boolean", "Date"] },
	isFalse: { cardinality: "none", category: "unary", name: "isFalse", valueTypes: ["boolean"] },
	isTrue: { cardinality: "none", category: "unary", name: "isTrue", valueTypes: ["boolean"] },
	lessThan: { cardinality: "one", category: "scalar", name: "lessThan", valueTypes: ["number"] },
	lessThanOrEqual: { cardinality: "one", category: "scalar", name: "lessThanOrEqual", valueTypes: ["number"] },
	notSet: { cardinality: "none", category: "unary", name: "notSet", valueTypes: ["string", "number", "boolean", "Date"] },
	on: { cardinality: "one", category: "scalar", name: "on", valueTypes: ["Date"] },
	startsWith: { cardinality: "one", category: "scalar", name: "startsWith", valueTypes: ["string"] },
};

export type OperatorName = keyof typeof OPERATOR_SPEC;

export const isOperator = (op: string): op is OperatorName => op in OPERATOR_SPEC;
