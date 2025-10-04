import { type Logger, pino } from "pino";

const isDevelopment = process.env.NODE_ENV === "development";

export const appLogger: Logger = pino({
	level: process.env.PINO_LOG_LEVEL || "info",

	redact: [], // prevent logging of sensitive data
	// Only use pino-pretty in development; use JSON logging in production
	...(isDevelopment && {
		transport: {
			options: {
				colorize: true,
			},
			target: "pino-pretty",
		},
	}),
});
