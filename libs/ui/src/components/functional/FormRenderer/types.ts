/** biome-ignore-all lint/suspicious/noConsole: TODO: remove */
import { z } from "zod/v4";
import type { PasswordRequirementProps, SelectOption } from "../FormInputs";

type CommonFieldMetadata = {
	name: string;
	label: string;
	placeholder?: string;
	description?: string;
	conditional?: {
		dependsOn: string;
		value: unknown;
	};
};

export type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};

export type FieldMetadata = Prettify<
	CommonFieldMetadata &
		(
			| {
					type: "text" | "number" | "email" | "password-no";
					inputMode?: "numeric" | "text" | "email";
					autoComplete?: string;
			  }
			| { type: "textarea" }
			| { type: "password"; passwordRequirements?: PasswordRequirementProps[] }
			| { type: "switch" }
			| {
					type: "datetime";
					disableDate?: (date: Date) => boolean;
					enableTimePicker?: boolean;
					showSeconds?: boolean;
					defaultTime?: { hours: number; minutes: number; seconds: number };
			  }
			| {
					type: "dateRange";
					disableDate?: (date: Date) => boolean;
			  }
			| {
					type: "choice";
					multiple?: boolean;
					options: SelectOption[];
			  }
		)
>;
export type FieldType = FieldMetadata["type"];

export const stringifyFieldMetadata = (fieldMetadata: FieldMetadata): string => JSON.stringify(fieldMetadata);

export const parseFieldMetadata = (fieldMetadataString: string): FieldMetadata => {
	try {
		const parsed = JSON.parse(fieldMetadataString);
		if (typeof parsed !== "object" || parsed === null) {
			throw new Error("Parsed metadata is not an object");
		}
		return parsed as FieldMetadata;
	} catch (error) {
		console.error("Failed to parse field metadata:", error);
		throw new Error("Invalid field metadata format");
	}
};

const CAMEL_TO_TITLE_REGEX = /([A-Z])/g;
const FIRST_CHAR_REGEX = /^./;

export const extractFieldConfigsFromSchema = (schema: z.ZodType, path = ""): FieldMetadata[] => {
	// For objects, process each property
	if (schema instanceof z.ZodObject) {
		const shape = schema.shape;
		const fields: FieldMetadata[] = [];

		for (const [key, fieldSchema] of Object.entries(shape)) {
			const fieldPath = path ? `${path}.${key}` : key;
			// Cast the fieldSchema to ZodTypeAny to ensure type compatibility
			const fieldConfigs = extractFieldConfigsFromSchema(fieldSchema as z.ZodType, fieldPath);
			fields.push(...fieldConfigs);
		}

		return fields;
	}

	const metadata: FieldMetadata = schema.description ? parseFieldMetadata(schema.description) : ({} as FieldMetadata);

	// Default label is required in FieldConfig
	const label = metadata.label || path.split(".").pop() || path;
	// Convert camelCase to Title Case
	const formattedLabel = label.replace(CAMEL_TO_TITLE_REGEX, " $1").replace(FIRST_CHAR_REGEX, (str) => str.toUpperCase());

	return [
		{
			...metadata,
			label: formattedLabel,
		},
	];
};
