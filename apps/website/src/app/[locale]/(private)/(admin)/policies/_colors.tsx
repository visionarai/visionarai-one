import type { ConditionLogicType, PermissionTypes } from "@visionarai-one/abac";
import { cn } from "@visionarai-one/utils";

export const conditionBorderColor = (logic: ConditionLogicType, className?: string) =>
	cn(
		{
			"border-amber-300 text-amber-700": logic === "OR",
			"border-emerald-300 text-emerald-700": logic === "AND",
			"border-rose-300 text-rose-700": logic === "NOT",
		},
		className
	);

export const conditionGroupLeftBorderColor = (logic: ConditionLogicType, className?: string) =>
	cn(
		{
			"border-amber-300": logic === "OR",
			"border-emerald-300": logic === "AND",
			"border-rose-300": logic === "NOT",
		},
		className
	);

export const decisionBorderColor = (decision: PermissionTypes, className?: string) =>
	cn(
		{
			"border-emerald-300 text-emerald-700": decision === "ALLOW",
			"border-rose-300 text-rose-700": decision === "DENY",
			"border-sky-300 text-sky-700": decision === "CONDITIONAL",
		},
		className
	);
