// Load config from environment variables using zod schemas and provide typesafe access to them with export runtimeConfig and log the missing variables on server start
import { z } from "zod";

const EnvSchema = z.object({
	BASE_URL: z.url().default("http://localhost:3000"),
	LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
	MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
	NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export type RuntimeConfig = z.infer<typeof EnvSchema> & {
	isDev: boolean;
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
	};
}

export const runtimeConfig = loadEnv();

function formatValidationErrors(error: z.ZodError): string {
	const { fieldErrors } = error.flatten();
	return Object.entries(fieldErrors)
		.map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : ""}`)
		.join("\n");
}
