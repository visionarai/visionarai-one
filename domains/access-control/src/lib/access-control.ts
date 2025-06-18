// ABAC system with Resources, Subjects, and Environment context

/**
 * Application resource definitions and their allowed actions.
 */
export const APP_RESOURCES = {
  workspace: ['read', 'write', 'delete', 'invite', 'manageSettings'],
  project: ['read', 'write', 'delete'],
} as const;

/**
 * All resource keys in the application.
 */
type AppResourceKey = keyof typeof APP_RESOURCES;

/**
 * All possible actions for a given resource key.
 */
type AppResourceActions<K extends AppResourceKey> = (typeof APP_RESOURCES)[K][number];

/**
 * Permissions can be a boolean (unconditional) or a ConditionGroup (conditional grant).
 * Example: { workspace: { read: true, write: { operator: 'AND', conditions: [...] } } }
 */
type Permissions = {
  [K in AppResourceKey]?: {
    [A in AppResourceActions<K>]?: boolean | ConditionGroup;
  };
};

/**
 * Represents a subject (user or group).
 */
type Subject = {
  _id: string;
  type: 'user' | 'group';
  workspaceId: string;
  clearanceLevel?: number;
};

/**
 * Represents a resource.
 */
type Resource = {
  _id: string;
  type: AppResourceKey;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  visibility?: 'public' | 'private' | 'departmental';
  requiredClearance?: number;
};

/**
 * Represents environmental context for the access check.
 */
type Environment = {
  ip: string;
  country: string;
  city?: string;
  requestTime: Date;
};

/** Field condition operations per type */
type CommonOperations = 'equals' | 'in' | 'exists';
type StringOperations = 'contains' | 'startsWith' | 'endsWith' | 'regex';
type NumberOperations = 'greaterThan' | 'lessThan' | 'greaterThanOrEqual' | 'lessThanOrEqual';
type DateOperations = 'before' | 'after' | 'on' | 'between';
type BooleanOperations = 'isTrue' | 'isFalse';

/**
 * All supported operations based on the field type.
 */
type OperationsMap<T> = T extends string
  ? CommonOperations | StringOperations
  : T extends number
  ? CommonOperations | NumberOperations
  : T extends boolean
  ? CommonOperations | BooleanOperations
  : T extends Date
  ? CommonOperations | DateOperations
  : CommonOperations;

/** Flatten nested object keys into dot notation strings. */
type NestedKeys<T, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends object ? `${Prefix}${K}` | NestedKeys<T[K], `${Prefix}${K}.`> : `${Prefix}${K}`;
}[keyof T & string];

/** Field identifiers for resources, subjects, and environment. */
type ResourceFields = `resource.${NestedKeys<Resource>}`;
type SubjectFields = `subject.${NestedKeys<Subject>}`;
type EnvironmentFields = `environment.${NestedKeys<Environment>}`;

type FieldIdentifier = PrettifyType<ResourceFields | SubjectFields | EnvironmentFields>;

/** Extract value type of a field identifier. */
type DeepValueOf<T, Path extends string> = Path extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? DeepValueOf<T[Key], Rest>
    : never
  : Path extends keyof T
  ? T[Path]
  : never;

type ValueOfField<F extends FieldIdentifier> = F extends `resource.${infer Key}`
  ? DeepValueOf<Resource, Key>
  : F extends `subject.${infer Key}`
  ? DeepValueOf<Subject, Key>
  : F extends `environment.${infer Key}`
  ? DeepValueOf<Environment, Key>
  : never;

type PrettifyType<T> = {
  [K in keyof T]: T[K];
} & {};

/**
 * Helper type: All field identifiers whose value type is assignable to T.
 */
type CompatibleFieldRefs<T> = {
  [F in FieldIdentifier]: ValueOfField<F> extends T ? F : never;
}[FieldIdentifier];

/**
 * Type-safe value for a condition: either a literal of the correct type, or a fieldRef to a compatible field.
 */
type ConditionValue<F extends FieldIdentifier> = { literal: ValueOfField<F> } | { fieldRef: CompatibleFieldRefs<ValueOfField<F>> };

/**
 * Type-safe condition: field, operation, and value are all type-checked.
 */
type Condition<F extends FieldIdentifier = FieldIdentifier> = {
  field: F;
  operation: OperationsMap<ValueOfField<F>>;
  value: ConditionValue<F>;
  inverse?: boolean;
};

/** Group of conditions for logical operations. Supports deep nesting. */
type ConditionGroup =
  | { operator: 'AND' | 'OR'; conditions: Array<Condition | ConditionGroup> }
  | { operator: 'NOT'; conditions: Condition | ConditionGroup | Array<Condition | ConditionGroup> };

/** ABAC Policy definition. (Zero Trust, allow only explicitly set permissions) */
type Policy = {
  name: string;
  description?: string;
  permissions: Permissions;
  conditionGroup?: ConditionGroup;
};

/** Zero Trust example policy with explicit allowed permissions and conditional grants. */
const examplePolicy: Policy = {
  name: 'Zero Trust Policy',
  description: 'Explicitly allow selected permissions only, with conditional and unconditional grants.',
  permissions: {
    workspace: {
      // Unconditional read
      read: true,
      // Conditional write: only allowed if subject is in the same department and has sufficient clearance
      write: {
        operator: 'AND',
        conditions: [
          {
            field: 'resource.workspaceId',
            operation: 'equals',
            value: { fieldRef: 'subject.workspaceId' },
          },
          {
            field: 'subject.clearanceLevel',
            operation: 'greaterThanOrEqual',
            value: { fieldRef: 'resource.requiredClearance' },
          },
        ],
      },
      // Conditional delete: only allowed if subject is the creator
      delete: {
        operator: 'AND',
        conditions: [
          {
            field: 'resource.createdBy',
            operation: 'equals',
            value: { fieldRef: 'subject._id' },
          },
        ],
      },
      // Unconditional invite
      invite: true,
      // Conditional manageSettings: only allowed from a specific IP
      manageSettings: {
        operator: 'AND',
        conditions: [
          {
            field: 'environment.ip',
            operation: 'equals',
            value: { literal: '192.168.1.100' },
          },
        ],
      },
    },
    project: {
      // Unconditional read
      read: true,
      // Conditional write: only if subject is a user and resource is public
      write: {
        operator: 'AND',
        conditions: [
          {
            field: 'subject.type',
            operation: 'equals',
            value: { fieldRef: 'subject.clearanceLevel' },
          },
          {
            field: 'resource.visibility',
            operation: 'equals',
            value: { literal: 'public' },
          },
        ],
      },
      // No delete permission
      delete: false,
    },
  },
  conditionGroup: {
    operator: 'AND',
    conditions: [
      // Global condition: subject must be a user
      { field: 'subject.type', operation: 'equals', value: { literal: 'user' } },
      // Global condition: request must come from a specific country
      { field: 'environment.country', operation: 'equals', value: { literal: 'IN' } },
      // Optional city check (now type-correct)
      { field: 'environment.city', operation: 'equals', value: { literal: 'Berlin' } }, // Optional city check
    ],
  },
};

/** Export example policy. */
export const accessControlPolicy = (): Policy => examplePolicy;
