/**
 * Allowed value cardinalities used by operations and value schemas.
 */
export const CARDINALITIES = ["none", "one", "many", "range"] as const;
export type Cardinality = (typeof CARDINALITIES)[number];

/**
 * Scalar primitive types supported by the policy engine.
 */
export const SCALAR_VALUE_TYPES = ["string", "number", "boolean", "Date"] as const;
export type ScalarValueType = (typeof SCALAR_VALUE_TYPES)[number];

export type OperationSpec = {
	/** Operation name identifier (e.g., "equals", "in") */
	name: string;
	/** Value cardinality expected by the operation */
	cardinality: Cardinality;
	/** Scalar types this operation can be applied to */
	validDataTypes: ScalarValueType[];
};

/**
 * Canonical list of supported operations.
 */
export const operationSpecs: OperationSpec[] = [
	{ cardinality: "one", name: "after", validDataTypes: ["Date"] },
	{ cardinality: "one", name: "before", validDataTypes: ["Date"] },
	{ cardinality: "range", name: "between", validDataTypes: ["Date", "number"] },
	{ cardinality: "one", name: "contains", validDataTypes: ["string"] },
	{ cardinality: "one", name: "endsWith", validDataTypes: ["string"] },
	{ cardinality: "one", name: "equals", validDataTypes: ["string", "number", "boolean", "Date"] },
	{ cardinality: "none", name: "exists", validDataTypes: ["string", "number", "boolean", "Date"] },
	{ cardinality: "one", name: "greaterThan", validDataTypes: ["number"] },
	{ cardinality: "many", name: "in", validDataTypes: ["string", "number", "boolean", "Date"] },
	{ cardinality: "none", name: "isFalse", validDataTypes: ["boolean"] },
	{ cardinality: "none", name: "isTrue", validDataTypes: ["boolean"] },
	{ cardinality: "one", name: "lessThan", validDataTypes: ["number"] },
	{ cardinality: "none", name: "notSet", validDataTypes: ["string", "number", "boolean", "Date"] },
	{ cardinality: "one", name: "on", validDataTypes: ["Date"] },
	{ cardinality: "one", name: "startsWith", validDataTypes: ["string"] },
] as const;

export type OperationName = (typeof operationSpecs)[number]["name"];

type Operation = {
	name: OperationName;
	cardinality: Cardinality;
};

const getOperationTypesForType = (type: ScalarValueType): Operation[] =>
	operationSpecs.filter((op) => op.validDataTypes.includes(type)).map((op) => ({ cardinality: op.cardinality, name: op.name }));

/**
 * Precomputed map of operations allowed for each scalar type.
 */
export const OPERATION_FOR_TYPE: Record<ScalarValueType, Operation[]> = Object.fromEntries(
	(SCALAR_VALUE_TYPES as readonly ScalarValueType[]).map((t) => [t, getOperationTypesForType(t)] as const)
) as Record<ScalarValueType, Operation[]>;
