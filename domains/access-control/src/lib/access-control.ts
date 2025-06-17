type ResourcePermissions<AccessResource extends Array<string>> = {
  [K in AccessResource[number]]: boolean;
};

type Permissions<AccessResource extends Record<string, ResourcePermissions<any>>> = {
  [K in keyof AccessResource]: AccessResource[K] extends ResourcePermissions<infer AccessTypes> ? ResourcePermissions<AccessTypes> : never;
};

type Subject = {
  _id: string;
  type: 'user' | 'group';
  workspaceId: string;
};

type Resource = {
  _id: string;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
};

type CommonOperations = 'equals' | 'in' | 'exists';
type StringOperations = 'contains' | 'startsWith' | 'endsWith' | 'regex';
type NumberOperations = 'greaterThan' | 'lessThan' | 'greaterThanOrEqual' | 'lessThanOrEqual';
type DateOperations = 'before' | 'after' | 'on' | 'between' | 'weekday' | 'weekend' | 'month' | 'year';
type BooleanOperations = 'isTrue' | 'isFalse';

type Operations = CommonOperations | StringOperations | NumberOperations | DateOperations | BooleanOperations;

// Simplified field identifiers
type ResourceFields = `resource.${keyof Resource & string}`;
type SubjectFields = `subject.${keyof Subject & string}`;
type FieldIdentifier = ResourceFields | SubjectFields;

// Extract the actual value type from a field path
type ValueOfField<F extends FieldIdentifier> = F extends `resource.${infer Key}`
  ? Key extends keyof Resource
    ? Resource[Key]
    : never
  : F extends `subject.${infer Key}`
  ? Key extends keyof Subject
    ? Subject[Key]
    : never
  : never;

type FieldOperationValueMap = {
  [F in FieldIdentifier]: {
    field: F;
    value: ValueOfField<F>;
    operation: Operations;
    inverse?: boolean;
  };
};

type Condition = FieldOperationValueMap[keyof FieldOperationValueMap];

export function accessControl(): string {
  // console.log(condition);
  // console.log('typeof', typeof condition.value);

  return 'access-control';
}
