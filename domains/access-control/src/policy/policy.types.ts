import { AllPossibleOperations } from "./operators.js";

export type Subject = {
  _id: string;
  currentWorkspaceId: string;
};

type NestedKeys<T, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends object ? `${Prefix}${K}` | NestedKeys<T[K], `${Prefix}${K}.`> : `${Prefix}${K}`;
}[keyof T & string];

export type Condition = {
  field: `subject.${NestedKeys<Subject>}`;
  operation: AllPossibleOperations;
  value: unknown;
};

export type ConditionGroup =
  | {
      operator: 'AND' | 'OR';
      conditions: Array<Condition | ConditionGroup>;
    }
  | {
      operator: 'NOT';
      conditions: Condition | ConditionGroup;
    };

export type PolicyType = {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;

  name: string;
  description?: string;
  permissions: {
    [resourceType: string]: {
      [action: string]: boolean | Condition | ConditionGroup;
    };
  };
  globalConditions?: Condition | ConditionGroup;
};
