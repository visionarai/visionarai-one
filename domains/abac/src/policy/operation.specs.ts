export const CARDINALITIES = ["none", "one", "many", "range"] as const;
export type Cardinality = (typeof CARDINALITIES)[number];

export const SCALAR_VALUE_TYPES = ["string", "number", "boolean", "Date"] as const;
export type ScalarValueType = (typeof SCALAR_VALUE_TYPES)[number];

export type OperationSpec = {
	name: string;
	cardinality: Cardinality;
	validDataTypes: ScalarValueType[];
};

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

type Operation = {
	name: string;
	cardinality: Cardinality;
};

const getOperationTypesForType = (type: ScalarValueType): Operation[] => {
	return operationSpecs.filter((op) => op.validDataTypes.includes(type)).map((op) => ({ cardinality: op.cardinality, name: op.name }));
};

export const OPERATION_FOR_TYPE: Record<ScalarValueType, Operation[]> = {
	boolean: getOperationTypesForType("boolean"),
	Date: getOperationTypesForType("Date"),
	number: getOperationTypesForType("number"),
	string: getOperationTypesForType("string"),
};
