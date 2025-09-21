import type { ConditionNode, ConditionsType, ValueType } from "@visionarai-one/abac";
import { Badge } from "@visionarai-one/ui";
import { cn } from "@visionarai-one/utils";

export type ConditionTreeProps = {
	conditions: ConditionsType;
	className?: string;
};

const formatValue = (v: string | number | boolean | Date) => {
	if (v instanceof Date) {
		return v.toISOString().split("T")[0];
	}
	if (typeof v === "string") {
		return `"${v}"`;
	}
	return String(v);
};

const renderValue = (value: ValueType): string => {
	const scopeLabel = value.scope === "literal" ? "lit" : value.scope;
	switch (value.cardinality) {
		case "none":
			return `${scopeLabel}: -`;
		case "one":
			return `${scopeLabel}: ${formatValue(value.value)}`;
		case "many": {
			const items = value.values.map(formatValue);
			const compact = items.length > 4 ? `${items.slice(0, 3).join(", ")}, +${items.length - 3}` : items.join(", ");
			return `${scopeLabel}: [${compact}]`;
		}
		case "range":
			return `${scopeLabel}: ${formatValue(value.start)} .. ${formatValue(value.end)}`;
		default:
			return "-";
	}
};

const ScopePill = ({ label }: { label: string }) => (
	<Badge className="px-1.5 py-0.5 text-[10px] leading-none" variant="outline">
		{label}
	</Badge>
);

const LogicPill = ({ logic }: { logic: ConditionsType["logic"] }) => {
	const conditionColor = cn(
		{
			"border-green-400 text-green-600": logic === "AND",
			"border-red-400 text-red-600": logic === "NOT",
			"border-yellow-400 text-yellow-600": logic === "OR",
		},
		"px-1.5 py-0.5 text-[10px]"
	);
	return (
		<Badge className={conditionColor} title="Logic group" variant="outline">
			{logic}
		</Badge>
	);
};

const FieldItem = ({ node }: { node: ConditionNode }) => {
	const { field, operation, value } = node;
	return (
		<div className="flex items-center gap-1 text-xs">
			<ScopePill label={field.scope} />
			<code className="rounded bg-muted px-1 py-0.5 text-[11px]">{field.name}</code>
			<span className="text-muted-foreground">:{field.type}</span>
			<span className="mx-1 text-muted-foreground">{operation}</span>
			<span className="truncate text-foreground">{renderValue(value)}</span>
		</div>
	);
};

const isGroup = (n: ConditionNode | ConditionsType): n is ConditionsType => {
	const candidate = n as ConditionsType;
	return Array.isArray(candidate.conditions) && typeof candidate.logic !== "undefined";
};

const GroupHeader = ({ logic, count }: { logic: ConditionsType["logic"]; count: number }) => (
	<div className="flex items-center gap-2">
		<LogicPill logic={logic} />
		<span className="text-[11px] text-muted-foreground">{count}</span>
	</div>
);

const keyForNode = (n: ConditionNode | ConditionsType, fallbackIndex: number): string => {
	if (isGroup(n)) {
		return `group:${n.logic}:${n.conditions.length}:${fallbackIndex}`;
	}
	const { field, operation, value } = n;
	const idPart = `${field.scope}:${field.name}:${operation}:${value.scope}:${value.cardinality}`;
	return `node:${idPart}:${fallbackIndex}`;
};

export const ConditionTree = ({ conditions, className }: ConditionTreeProps) => {
	const renderGroup = (g: ConditionsType) => {
		const conditionBorderColor = cn(
			{
				"border-green-400": g.logic === "AND",
				"border-red-400": g.logic === "NOT",
				"border-yellow-400": g.logic === "OR",
			},
			"border-l pl-3"
		);
		return (
			<div>
				<div className="mb-1">
					<GroupHeader count={g.conditions.length} logic={g.logic} />
				</div>
				<div className={conditionBorderColor}>
					{g.conditions.map((c, idx) => (
						<div className="py-1" key={keyForNode(c, idx)}>
							{isGroup(c) ? renderGroup(c) : <FieldItem node={c} />}
						</div>
					))}
				</div>
			</div>
		);
	};

	return <div className={className ? `text-sm ${className}` : "text-sm"}>{renderGroup(conditions)}</div>;
};

export default ConditionTree;
