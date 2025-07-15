import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

export const AppErrorCodes = {
  MASTER_DATA_NOT_FOUND: {
    en: 'Master data not found',
    de: 'Stammdaten nicht gefunden',
    statusCode: StatusCodes.NOT_FOUND,
  },
  RESOURCE_TYPE_NOT_ALLOWED: {
    en: '{resource} resource type is not allowed',
    de: '{resource} Ressourcentyp ist nicht erlaubt',
    statusCode: StatusCodes.BAD_REQUEST,
    metaData: z.object({
      resource: z.string(),
    }),
  },
  POLICY_NOT_FOUND: {
    en: 'Policy not found',
    de: 'Richtlinie nicht gefunden',
    statusCode: StatusCodes.NOT_FOUND,
  },
  POLICY_CREATION_FAILED: {
    en: 'Policy creation failed',
    de: 'Erstellung der Richtlinie fehlgeschlagen',
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
  },
};

export type APP_ERROR_CODE_KEYS = keyof typeof AppErrorCodes;

export type AppErrorOptions<K extends APP_ERROR_CODE_KEYS> =
  (typeof AppErrorCodes)[K] extends { metaData: z.ZodTypeAny }
    ? {
        context?: Record<string, unknown>;
        metadata: z.infer<NonNullable<(typeof AppErrorCodes)[K]['metaData']>>;
      }
    : {
        context?: Record<string, unknown>;
        metadata?: never;
      };
