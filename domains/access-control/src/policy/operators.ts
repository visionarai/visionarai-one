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

export type AllPossibleOperations = OperationTypeForDataType<OperationDataType>;

export const isValidOperation = (operation: string, dataType: OperationDataType): operation is OperationTypeForDataType<OperationDataType> => {
  return (OPERATION_TYPES[dataType] as readonly string[]).includes(operation);
};

export const performOperation = <T extends OperationDataType>(
  operation: OperationTypeForDataType<T>,
  value: OperationTypeToTSType<T>,
  compareValue: OperationTypeToTSType<T> | OperationTypeToTSType<T>[]
): boolean => {
  switch (operation) {
    case 'equals':
      return Array.isArray(compareValue) ? compareValue.includes(value) : value === compareValue;
    case 'in':
      return Array.isArray(compareValue) && compareValue.includes(value);
    case 'exists':
      return value !== undefined && value !== null;
    case 'contains':
      return typeof value === 'string' && typeof compareValue === 'string' && value.includes(compareValue);
    case 'startsWith':
      return typeof value === 'string' && typeof compareValue === 'string' && value.startsWith(compareValue);
    case 'endsWith':
      return typeof value === 'string' && typeof compareValue === 'string' && value.endsWith(compareValue);
    case 'regex':
      return typeof value === 'string' && compareValue instanceof RegExp && compareValue.test(value);
    case 'greaterThan':
      return typeof value === 'number' && typeof compareValue === 'number' && value > compareValue;
    case 'lessThan':
      return typeof value === 'number' && typeof compareValue === 'number' && value < compareValue;
    case 'greaterThanOrEqual':
      return typeof value === 'number' && typeof compareValue === 'number' && value >= compareValue;
    case 'lessThanOrEqual':
      return typeof value === 'number' && typeof compareValue === 'number' && value <= compareValue;
    case 'before':
      return value instanceof Date && compareValue instanceof Date && value < compareValue;
    case 'after':
      return value instanceof Date && compareValue instanceof Date && value > compareValue;
    case 'on':
      return value instanceof Date && compareValue instanceof Date && value.getTime() === compareValue.getTime();
    case 'between':
      if (Array.isArray(compareValue) && compareValue.length === 2) {
        const [start, end] = compareValue as unknown as [Date, Date];
        return value instanceof Date && start instanceof Date && end instanceof Date && value >= start && value <= end;
      }
      return false;
    case 'isTrue':
      return typeof value === 'boolean' && value === true;
    case 'isFalse':
      return typeof value === 'boolean' && value === false;
    case 'notSet':
      return value === undefined || value === null;
    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
};
