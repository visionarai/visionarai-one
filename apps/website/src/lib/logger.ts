import { type Logger, pino } from "pino";
import { runtimeConfig } from "@/lib/runtime-conf";

export const appLogger: Logger = pino({
	level: runtimeConfig.LOG_LEVEL,

	redact: [], // prevent logging of sensitive data
	// Only use pino-pretty in development; use JSON logging in production
	...(runtimeConfig.isDev && {
		transport: {
			options: {
				colorize: true,
			},
			target: "pino-pretty",
		},
	}),
});
