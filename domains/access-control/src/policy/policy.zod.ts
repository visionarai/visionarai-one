import { z } from "zod";
import { OPERATION_TYPES } from "./operators.js";
// Subject schema
export const SubjectSchema = z.object({
	_id: z.string(),
	currentWorkspaceId: z.string(),
});

// Helper for NestedKeys (flattened for Zod, can be extended as needed)
const subjectFields = ["subject._id", "subject.currentWorkspaceId"] as const;
export const SubjectFieldSchema = z.enum(subjectFields);

// typeOfValue options
// const typeOfValueOptions = ["string", "number", "boolean", "Date", "string[]", "number[]", "boolean[]", "Date[]"] as const;
const typeOfValueOptions = ["string", "number", "boolean", "Date"] as const;
export const TypeOfValueSchema = z.enum(typeOfValueOptions);

// Operation options (flattened for Zod, can be improved for stricter typing)
const allOperations = [...new Set(Object.values(OPERATION_TYPES).flat())];
export const OperationSchema = z.enum(allOperations);

// Condition schema
export const ConditionSchema = z.object({
	field: SubjectFieldSchema,
	operation: OperationSchema,
	typeOfValue: TypeOfValueSchema,
	value: z.union([z.string(), z.number(), z.boolean(), z.date(), z.array(z.string()), z.array(z.number()), z.array(z.boolean()), z.array(z.date())]),
});

// Recursive type for ConditionGroup
export type ConditionGroupType =
	| {
			operator: "AND" | "OR";
			conditions: Array<z.infer<typeof ConditionSchema> | ConditionGroupType>;
	  }
	| {
			operator: "NOT";
			conditions: z.infer<typeof ConditionSchema> | ConditionGroupType;
	  };

// ConditionGroup schema (recursive, type-safe)
export const ConditionGroupSchema: z.ZodType<ConditionGroupType> = z.lazy(() =>
	z.union([
		z.object({
			conditions: z.array(z.union([ConditionSchema, ConditionGroupSchema])),
			operator: z.enum(["AND", "OR"]),
		}),
		z.object({
			conditions: z.union([ConditionSchema, ConditionGroupSchema]),
			operator: z.literal("NOT"),
		}),
	])
);

// PolicyType schema
export const PolicyTypeSchema = z.object({
	_id: z.string(),
	createdAt: z.date(),
	createdBy: z.string(),
	description: z.string().optional(),
	globalConditions: z.union([ConditionSchema, ConditionGroupSchema]).optional(),
	name: z.string(),
	permissions: z.record(z.string(), z.record(z.string(), z.union([z.boolean(), ConditionSchema, ConditionGroupSchema]))),
	updatedAt: z.date(),
});

// Use Zod-inferred types for type safety
export type Condition = z.infer<typeof ConditionSchema>;
export type ConditionGroup = z.infer<typeof ConditionGroupSchema>;
export type PolicyType = z.infer<typeof PolicyTypeSchema>;
export type Subject = z.infer<typeof SubjectSchema>;

export const nullPolicy: PolicyType = {
	_id: "",
	createdAt: new Date(),
	createdBy: "",
	description: "",
	globalConditions: {
		field: "subject._id",
		operation: "equals",
		typeOfValue: "string",
		value: "Sanyam Arya",
	},
	name: "",
	permissions: {},
	updatedAt: new Date(),
};

export const nullCondition: Condition = {
	field: "subject._id",
	operation: "equals",
	typeOfValue: "string",
	value: "",
};

// Regex constants for performance (compiled once)
const camelCaseRegex = /([a-z])([A-Z])/g;
const firstCharRegex = /^./;

// Helper function to convert camelCase to Title Case
const toTitleCase = (str: string): string => {
	return str
		.replace(camelCaseRegex, "$1 $2") // Insert space before capital letters
		.replace(firstCharRegex, (char) => char.toUpperCase()); // Capitalize first letter
};

export const ALL_OPERATIONS_OPTIONS: Array<{ label: string; value: string }> = allOperations.map((op) => ({ label: toTitleCase(op), value: op }));

export const ALL_TYPE_OF_VALUE_OPTIONS: Array<{ label: string; value: string }> = TypeOfValueSchema.options.map((type) => ({
	label: toTitleCase(type),
	value: type,
}));
