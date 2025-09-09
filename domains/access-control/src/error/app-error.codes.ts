import { StatusCodes } from "http-status-codes";
import { z } from "zod";

export const AppErrorCodes = {
	MASTER_DATA_NOT_FOUND: {
		de: "Stammdaten nicht gefunden",
		en: "Master data not found",
		statusCode: StatusCodes.NOT_FOUND,
	},
	POLICY_CREATION_FAILED: {
		de: "Erstellung der Richtlinie fehlgeschlagen",
		en: "Policy creation failed",
		statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
	},
	POLICY_NOT_FOUND: {
		de: "Richtlinie nicht gefunden",
		en: "Policy not found",
		statusCode: StatusCodes.NOT_FOUND,
	},
	RESOURCE_TYPE_NOT_ALLOWED: {
		de: "{resource} Ressourcentyp ist nicht erlaubt",
		en: "{resource} resource type is not allowed",
		metaData: z.object({
			resource: z.string(),
		}),
		statusCode: StatusCodes.BAD_REQUEST,
	},
};

export type APP_ERROR_CODE_KEYS = keyof typeof AppErrorCodes;

export type AppErrorOptions<K extends APP_ERROR_CODE_KEYS> = (typeof AppErrorCodes)[K] extends { metaData: z.ZodTypeAny }
	? {
			context?: Record<string, unknown>;
			metadata: z.infer<NonNullable<(typeof AppErrorCodes)[K]["metaData"]>>;
		}
	: {
			context?: Record<string, unknown>;
			metadata?: never;
		};
