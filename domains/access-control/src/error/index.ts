import { StatusCodes } from 'http-status-codes';
import {
  type APP_ERROR_CODE_KEYS,
  AppErrorCodes,
  type AppErrorOptions,
} from './app-error.codes.js';

export class AppError<ErrorCode extends APP_ERROR_CODE_KEYS> extends Error {
  errorCode: ErrorCode;
  where: string | undefined;
  metadata: AppErrorOptions<ErrorCode>['metadata'] | undefined;
  statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR;
  context: Record<string, unknown> | undefined;

  constructor(
    code: ErrorCode,
    { context = {}, metadata = {} }: AppErrorOptions<ErrorCode>
  ) {
    super(code as string);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);

    this.errorCode = code;
    this.statusCode =
      AppErrorCodes[code as APP_ERROR_CODE_KEYS]?.statusCode ||
      StatusCodes.INTERNAL_SERVER_ERROR;
    this.context = context;

    const stack = this.stack?.split('\n');
    const where = stack?.[1]?.trim().replace('at ', '');
    this.where = where;

    this.metadata = metadata || null;
  }
}

export function isAppError(
  error: unknown
): error is AppError<APP_ERROR_CODE_KEYS> {
  return error instanceof AppError && error.name === 'AppError';
}
