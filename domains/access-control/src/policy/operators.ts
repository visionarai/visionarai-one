const COMMON_OPS = ['equals', 'in', 'exists'] as const;
export const OPERATION_TYPES = {
  string: ['contains', 'startsWith', 'endsWith', 'regex', ...COMMON_OPS],
  number: ['greaterThan', 'lessThan', 'greaterThanOrEqual', 'lessThanOrEqual', ...COMMON_OPS],
  Date: ['before', 'after', 'on', 'between', ...COMMON_OPS],
  boolean: ['isTrue', 'isFalse', 'notSet'],
} as const;

type OperationDataType = keyof typeof OPERATION_TYPES;
export type OperationTypeForDataType<T extends OperationDataType> = (typeof OPERATION_TYPES)[T][number];

// Map operation data type to TS type
export type OperationTypeToTSType<T extends OperationDataType> = T extends 'string'
  ? string
  : T extends 'number'
  ? number
  : T extends 'Date'
  ? Date
  : T extends 'boolean'
  ? boolean
  : never;

export type OperationTypeForType<T extends keyof typeof OPERATION_TYPES> = (typeof OPERATION_TYPES)[T][number];
