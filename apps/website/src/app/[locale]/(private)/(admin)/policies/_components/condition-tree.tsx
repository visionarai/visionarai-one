import type { ExpressionGroupType, ExpressionNodeType, ValueType } from "@visionarai-one/abac";
import { Badge, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@visionarai-one/ui";
import React, { useCallback, useMemo } from "react";
import { conditionBorderColor, conditionGroupLeftBorderColor } from "./utils";

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

type RenderedValue = { display: string; full: string };

const renderValue = (value: ValueType): RenderedValue => {
	const scopeLabel = value.scope === "literal" ? "lit" : value.scope;
	switch (value.cardinality) {
		case "none": {
			const txt = `${scopeLabel}: -`;
			return { display: txt, full: txt };
		}
		case "one": {
			const txt = `${scopeLabel}: ${formatValue(value.value)}`;
			return { display: txt, full: txt };
		}
		case "many": {
			const items = value.values.map(formatValue);
			const compact = items.length > 4 ? `${items.slice(0, 3).join(", ")}, +${items.length - 3}` : items.join(", ");
			const display = `${scopeLabel}: [${compact}]`;
			const full = `${scopeLabel}: [${items.join(", ")}]`;
			return { display, full };
		}
		case "range": {
			const txt = `${scopeLabel}: ${formatValue(value.start)} .. ${formatValue(value.end)}`;
			return { display: txt, full: txt };
		}
		default:
			return { display: "-", full: "-" };
	}
};

const ScopePill = React.memo(({ label }: { label: string }) => (
	<Badge className="px-1 py-0 font-medium text-[10px] leading-none" variant="secondary">
		{label}
	</Badge>
));

const LogicPill = React.memo(({ logic }: { logic: ExpressionGroupType["logic"] }) => (
	<Badge className={conditionBorderColor(logic, "px-1.5 py-0.5 font-semibold text-[10px]")} title="Logic group" variant="outline">
		{logic}
	</Badge>
));

const FieldItem = React.memo(({ node }: { node: ExpressionNodeType }) => {
	const { field, operation, value } = node;
	const rendered = renderValue(value);
	const ariaLabel = `${field.scope} ${field.name} ${operation} ${rendered.full}`;
	const content = (
		<div
			aria-label={ariaLabel}
			className="group flex items-center gap-1.5 rounded border border-transparent px-1.5 py-0.5 transition-colors hover:border-border hover:bg-muted/50"
			role="treeitem"
			tabIndex={0}
		>
			<div className="flex items-center gap-1">
				<ScopePill label={field.scope} />
				<code className="rounded bg-background px-1 py-0.5 font-semibold text-[10px] text-foreground shadow-sm ring-1 ring-border">{field.name}</code>
				<span className="text-[9px] text-muted-foreground">{field.type}</span>
			</div>
			<span className="font-medium font-mono text-[10px] text-muted-foreground">{operation}</span>
			<span className="truncate font-mono text-[10px] text-foreground" title={rendered.full}>
				{rendered.display}
			</span>
		</div>
	);
	// Only show tooltip when the display is a truncated variant (many with >4 items)
	const needsTooltip = rendered.display !== rendered.full;
	if (!needsTooltip) {
		return content;
	}
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>{content}</TooltipTrigger>
				<TooltipContent className="max-w-xs break-words" side="top">
					<span className="font-mono text-xs">{rendered.full}</span>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
});

const isGroup = (n: ExpressionNodeType | ExpressionGroupType): n is ExpressionGroupType =>
	Array.isArray((n as ExpressionGroupType).expressions) && typeof (n as ExpressionGroupType).logic !== "undefined";

const GroupHeader = React.memo(({ logic, count, depth }: { logic: ExpressionGroupType["logic"]; count: number; depth: number }) => (
	<div className="mb-1 flex items-center gap-1.5" role={depth === 0 ? "tree" : "group"}>
		<LogicPill logic={logic} />
		<span className="text-[9px] text-muted-foreground">
			{count} {count === 1 ? "condition" : "conditions"}
		</span>
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
	const renderGroup = useCallback((g: ExpressionGroupType, depth: number) => {
		// Handle empty group
		if (!g.expressions.length) {
			return (
				<div className="text-muted-foreground text-xs italic" key={`empty:${depth}`}>
					No conditions
				</div>
			);
		}

		return (
			<div className="space-y-1">
				<GroupHeader count={g.expressions.length} depth={depth} logic={g.logic} />
				<div className={conditionGroupLeftBorderColor(g.logic, "space-y-1 border-l pl-2")}>
					{g.expressions.map((c, idx) => {
						const childKey = keyForNode(c, idx);
						return (
							<div key={childKey}>
								{isGroup(c) ? <div className="pt-0.5">{renderGroup(c as ExpressionGroupType, depth + 1)}</div> : <FieldItem node={c as ExpressionNodeType} />}
							</div>
						);
					})}
				</div>
			</div>
		);
	}, []);

	const tree = useMemo(() => renderGroup(conditions, 0), [conditions, renderGroup]);
	return <div className={className ? `text-sm ${className}` : "text-sm"}>{tree}</div>;
};

export default ConditionTree;
