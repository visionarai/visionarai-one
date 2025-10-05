import { z } from "zod";

/**
 * Set of string values considered as true.
 */
const TRUTHY_VALUES = new Set(["true", "True", "t", "T", "1"]);

/**
 * Set of string values considered as false.
 */
const FALSY_VALUES = new Set(["false", "False", "f", "F", "0"]);

/**
 * Converts string representations of booleans to boolean values.
 * Accepts 'true', 'True', 't', 'T', '1' as true and 'false', 'False', 'f', 'F', '0' as false.
 * Returns original value otherwise.
 */
const toBoolean = (val: string): boolean | string => {
	if (TRUTHY_VALUES.has(val)) {
		return true;
	}
	if (FALSY_VALUES.has(val)) {
		return false;
	}
	return val;
};

/**
 * Zod schema for transforming a string to a boolean.
 */
export const booleanTransformSchema = z
	.string()
	.transform(toBoolean)
	.refine((val) => typeof val === "boolean", { message: "Invalid boolean" });

const EnvSchema = z.object({
	BASE_URL: z.url().default("http://localhost:3000"),
	DASHBOARD_FEATURE_ENABLED: booleanTransformSchema.default(false),
	GITHUB_CLIENT_ID: z.string().min(1, "GITHUB_CLIENT_ID is required"),
	GITHUB_CLIENT_SECRET: z.string().min(1, "GITHUB_CLIENT_SECRET is required"),
	LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
	MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
	NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export type RuntimeConfig = z.infer<typeof EnvSchema> & {
	isDev: boolean;
	orpcUrl: string;
};
export function loadEnv(): RuntimeConfig {
	const parsed = EnvSchema.safeParse(process.env);

	if (!parsed.success) {
		const errorMessages = formatValidationErrors(parsed.error);
		throw new Error(errorMessages);
	}
	return {
		...parsed.data,
		isDev: process.env.NODE_ENV === "development",
		orpcUrl: `${parsed.data.BASE_URL}/rpc`,
	};
}

export const runtimeConfig = loadEnv();

function formatValidationErrors(error: z.ZodError): string {
	const { fieldErrors } = error.flatten();
	return Object.entries(fieldErrors)
		.map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : ""}`)
		.join("\n");
}
