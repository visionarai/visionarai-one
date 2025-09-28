import type { ConditionLogicType, PermissionTypes } from "@visionarai-one/abac";
import { cn } from "@visionarai-one/utils";

export const conditionBorderColor = (logic: ConditionLogicType, className?: string) =>
	cn(
		{
			"border-amber-300 text-amber-700 dark:border-amber-400 dark:text-amber-300": logic === "OR",
			"border-emerald-300 text-emerald-700 dark:border-emerald-400 dark:text-emerald-300": logic === "AND",
			"border-rose-300 text-rose-700 dark:border-rose-400 dark:text-rose-300": logic === "NOT",
		},
		className
	);

export const conditionGroupLeftBorderColor = (logic: ConditionLogicType, className?: string) =>
	cn(
		{
			"border-amber-300 dark:border-amber-400": logic === "OR",
			"border-emerald-300 dark:border-emerald-400": logic === "AND",
			"border-rose-300 dark:border-rose-400": logic === "NOT",
		},

		className
	);

export const decisionBorderColor = (decision: PermissionTypes, className?: string) =>
	cn(
		{
			"border-emerald-300 text-emerald-700 dark:border-emerald-400 dark:text-emerald-300": decision === "ALLOW",
			"border-rose-300 text-rose-700 dark:border-rose-400 dark:text-rose-300": decision === "DENY",
			"border-sky-300 text-sky-700 dark:border-sky-400 dark:text-sky-300": decision === "CONDITIONAL",
		},
		"border-2",
		className
	);
