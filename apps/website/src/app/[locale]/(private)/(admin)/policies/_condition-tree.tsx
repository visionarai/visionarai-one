import type { ExpressionGroupType, ExpressionNodeType, ValueType } from "@visionarai-one/abac";
import { Badge } from "@visionarai-one/ui";
import React, { useCallback, useMemo } from "react";
import { conditionBorderColor, conditionGroupLeftBorderColor } from "./_colors";

export type ConditionTreeProps = {
	conditions: ExpressionGroupType;
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

const ScopePill = React.memo(({ label }: { label: string }) => (
	<Badge className="px-1.5 py-0.5 text-[10px] leading-none" variant="outline">
		{label}
	</Badge>
));

const LogicPill = React.memo(({ logic }: { logic: ExpressionGroupType["logic"] }) => (
	<Badge className={conditionBorderColor(logic)} title="Logic group" variant="outline">
		{logic}
	</Badge>
));

const FieldItem = React.memo(({ node }: { node: ExpressionNodeType }) => {
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
});

const isGroup = (n: ExpressionNodeType | ExpressionGroupType): n is ExpressionGroupType =>
	Array.isArray((n as ExpressionGroupType).expressions) && typeof (n as ExpressionGroupType).logic !== "undefined";

const GroupHeader = React.memo(({ logic, count }: { logic: ExpressionGroupType["logic"]; count: number }) => (
	<div className="flex items-center gap-2">
		<LogicPill logic={logic} />
		<span className="text-[11px] text-muted-foreground">{count}</span>
	</div>
));

const keyForNode = (n: ExpressionNodeType | ExpressionGroupType, fallbackIndex: number): string => {
	if (isGroup(n)) {
		return `group:${n.logic}:${n.expressions.length}:${fallbackIndex}`;
	}
	const { field, operation, value } = n as ExpressionNodeType;
	const idPart = `${field.scope}:${field.name}:${operation}:${value.scope}:${value.cardinality}`;
	return `node:${idPart}:${fallbackIndex}`;
};

export const ConditionTree = ({ conditions, className }: ConditionTreeProps) => {
	const renderGroup = useCallback(
		(g: ExpressionGroupType) => (
			<div>
				<div className="mb-1">
					<GroupHeader count={g.expressions.length} logic={g.logic} />
				</div>
				<div className={conditionGroupLeftBorderColor(g.logic, "border-l pl-3")}>
					{g.expressions.map((c, idx) => (
						<div className="py-1" key={keyForNode(c, idx)}>
							{isGroup(c) ? renderGroup(c) : <FieldItem node={c as ExpressionNodeType} />}
						</div>
					))}
				</div>
			</div>
		),
		[]
	);

	const tree = useMemo(() => renderGroup(conditions), [conditions, renderGroup]);
	return <div className={className ? `text-sm ${className}` : "text-sm"}>{tree}</div>;
};

export default ConditionTree;
