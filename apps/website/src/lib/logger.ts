import { type Logger, pino } from "pino";

export const appLogger: Logger = pino({
	level: process.env.PINO_LOG_LEVEL || "info",

	redact: [], // prevent logging of sensitive data
	transport: {
		options: {
			colorize: true,
		},
		target: "pino-pretty",
	},
});
