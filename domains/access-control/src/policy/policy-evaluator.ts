import { performOperation } from './operators.js';
import type {
  Condition,
  ConditionGroup,
  PolicyType,
  Subject,
} from './policy.zod.js';

// Type guards for supported types
const isSupportedType = (
  value: unknown
): value is string | number | boolean | Date =>
  typeof value === 'string' ||
  typeof value === 'number' ||
  typeof value === 'boolean' ||
  value instanceof Date;

const isSupportedTypeOrArray = (
  value: unknown
): value is
  | string
  | number
  | boolean
  | Date
  | Array<string | number | boolean | Date> =>
  Array.isArray(value) ? value.every(isSupportedType) : isSupportedType(value);

const SUBJECT_PREFIX_REGEX = /^subject\./;

/**
 * Extracts a nested value from the subject using dot notation (e.g., 'subject._id').
 */
const getSubjectFieldValue = (field: string, subject: Subject): unknown => {
  const path = field.replace(SUBJECT_PREFIX_REGEX, '').split('.');
  return path.reduce<unknown>(
    (acc, key) =>
      typeof acc === 'object' && acc !== null && key in acc
        ? (acc as Record<string, unknown>)[key]
        : undefined,
    subject
  );
};

/**
 * Evaluates a single condition against the provided subject context.
 */
const evaluateCondition = (condition: Condition, subject: Subject): boolean => {
  const value = getSubjectFieldValue(condition.field, subject);
  if (!(isSupportedType(value) && isSupportedTypeOrArray(condition.value))) {
    return false;
  }
  return performOperation(condition.operation, value, condition.value);
};

/**
 * Recursively evaluates a condition group (AND, OR, NOT).
 */
const evaluateConditionGroup = (
  group: ConditionGroup,
  subject: Subject
): boolean => {
  const { operator, conditions } = group;
  if (operator === 'AND') {
    return (conditions as Array<Condition | ConditionGroup>).every((cond) =>
      'operator' in cond
        ? evaluateConditionGroup(cond as ConditionGroup, subject)
        : evaluateCondition(cond as Condition, subject)
    );
  }
  if (operator === 'OR') {
    return (conditions as Array<Condition | ConditionGroup>).some((cond) =>
      'operator' in cond
        ? evaluateConditionGroup(cond as ConditionGroup, subject)
        : evaluateCondition(cond as Condition, subject)
    );
  }
  if (operator === 'NOT') {
    const cond = conditions as Condition | ConditionGroup;
    return !('operator' in cond
      ? evaluateConditionGroup(cond as ConditionGroup, subject)
      : evaluateCondition(cond as Condition, subject));
  }
  return false;
};

/**
 * Evaluates if a subject is allowed to perform an action on a resource according to the policy.
 */
export const evaluatePolicy = ({
  policy,
  resourceType,
  action,
  subject,
}: {
  policy: PolicyType;
  resourceType: string;
  action: string;
  subject: Subject;
}): boolean => {
  const permissions = policy.permissions[resourceType];
  if (!permissions) {
    return false;
  }
  const permission = permissions[action];
  if (typeof permission === 'boolean') {
    return permission;
  }
  if (!permission) {
    return false;
  }

  // Evaluate global conditions if present
  if (policy.globalConditions) {
    const globalResult =
      'operator' in policy.globalConditions
        ? evaluateConditionGroup(
            policy.globalConditions as ConditionGroup,
            subject
          )
        : evaluateCondition(policy.globalConditions as Condition, subject);
    if (!globalResult) {
      return false;
    }
  }

  // Evaluate action-specific condition(s)
  if ('operator' in permission) {
    return evaluateConditionGroup(permission as ConditionGroup, subject);
  }
  return evaluateCondition(permission as Condition, subject);
};
