const COMMON_OPS = ['equals', 'in', 'exists'] as const;
export const OPERATION_TYPES = {
  string: ['contains', 'startsWith', 'endsWith', 'regex', ...COMMON_OPS],
  number: [
    'greaterThan',
    'lessThan',
    'greaterThanOrEqual',
    'lessThanOrEqual',
    ...COMMON_OPS,
  ],
  Date: ['before', 'after', 'on', 'between', ...COMMON_OPS],
  boolean: ['isTrue', 'isFalse', 'notSet'],
} as const;

type OperationDataType = keyof typeof OPERATION_TYPES;
export type OperationTypeForDataType<T extends OperationDataType> =
  (typeof OPERATION_TYPES)[T][number];

// Map operation data type to TS type
export type OperationTypeToTSType<T extends OperationDataType> =
  T extends 'string'
    ? string
    : T extends 'number'
      ? number
      : T extends 'Date'
        ? Date
        : T extends 'boolean'
          ? boolean
          : never;

export type AllPossibleOperations = OperationTypeForDataType<OperationDataType>;

export const isValidOperation = (
  operation: string,
  dataType: OperationDataType
): operation is OperationTypeForDataType<OperationDataType> => {
  return (OPERATION_TYPES[dataType] as readonly string[]).includes(operation);
};

// Operation handler lookup
const operationHandlers: Record<
  string,
  (value: unknown, compareValue: unknown) => boolean
> = {
  equals: (value, compareValue) =>
    Array.isArray(compareValue)
      ? compareValue.includes(value)
      : value === compareValue,
  in: (value, compareValue) =>
    Array.isArray(compareValue) && compareValue.includes(value),
  exists: (value) => value !== undefined && value !== null,
  contains: (value, compareValue) =>
    typeof value === 'string' &&
    typeof compareValue === 'string' &&
    value.includes(compareValue),
  startsWith: (value, compareValue) =>
    typeof value === 'string' &&
    typeof compareValue === 'string' &&
    value.startsWith(compareValue),
  endsWith: (value, compareValue) =>
    typeof value === 'string' &&
    typeof compareValue === 'string' &&
    value.endsWith(compareValue),
  regex: (value, compareValue) =>
    typeof value === 'string' &&
    compareValue instanceof RegExp &&
    compareValue.test(value),
  greaterThan: (value, compareValue) =>
    typeof value === 'number' &&
    typeof compareValue === 'number' &&
    value > compareValue,
  lessThan: (value, compareValue) =>
    typeof value === 'number' &&
    typeof compareValue === 'number' &&
    value < compareValue,
  greaterThanOrEqual: (value, compareValue) =>
    typeof value === 'number' &&
    typeof compareValue === 'number' &&
    value >= compareValue,
  lessThanOrEqual: (value, compareValue) =>
    typeof value === 'number' &&
    typeof compareValue === 'number' &&
    value <= compareValue,
  before: (value, compareValue) =>
    value instanceof Date &&
    compareValue instanceof Date &&
    value < compareValue,
  after: (value, compareValue) =>
    value instanceof Date &&
    compareValue instanceof Date &&
    value > compareValue,
  on: (value, compareValue) =>
    value instanceof Date &&
    compareValue instanceof Date &&
    value.getTime() === compareValue.getTime(),
  between: (value, compareValue) => {
    if (Array.isArray(compareValue) && compareValue.length === 2) {
      const [start, end] = compareValue as [Date, Date];
      return (
        value instanceof Date &&
        start instanceof Date &&
        end instanceof Date &&
        value >= start &&
        value <= end
      );
    }
    return false;
  },
  isTrue: (value) => typeof value === 'boolean' && value === true,
  isFalse: (value) => typeof value === 'boolean' && value === false,
  notSet: (value) => value === undefined || value === null,
};

/**
 * Performs an operation on the given value(s) using a lookup table for handlers.
 */
export const performOperation = <T extends OperationDataType>(
  operation: OperationTypeForDataType<T>,
  value: OperationTypeToTSType<T>,
  compareValue: OperationTypeToTSType<T> | OperationTypeToTSType<T>[]
): boolean => {
  const handler = operationHandlers[operation];
  if (!handler) {
    throw new Error(`Unknown operation: ${operation}`);
  }
  return handler(value, compareValue);
};
