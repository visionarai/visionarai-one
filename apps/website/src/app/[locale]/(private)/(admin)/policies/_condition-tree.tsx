import type { ExpressionGroupType, ExpressionNodeType, ValueType } from "@visionarai-one/abac";
import { Badge, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@visionarai-one/ui";
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
	const rendered = renderValue(value);
	const ariaLabel = `${field.scope} ${field.name} ${operation} ${rendered.full}`;
	const content = (
		<div aria-label={ariaLabel} className="flex items-center gap-1 text-xs" role="treeitem" tabIndex={0}>
			<ScopePill label={field.scope} />
			<code className="rounded bg-muted px-1 py-0.5 text-[11px]">{field.name}</code>
			<span className="text-muted-foreground">:{field.type}</span>
			<span className="mx-1 text-muted-foreground">{operation}</span>
			<span className="truncate text-foreground" title={rendered.full}>
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
	<div className="flex items-center gap-2" role={depth === 0 ? "tree" : "group"}>
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
	const renderGroup = useCallback((g: ExpressionGroupType, depth: number) => {
		// Handle empty group (should not happen except for blank constant)
		if (!g.expressions.length) {
			return (
				<div className="text-muted-foreground text-xs italic" key={`empty:${depth}`}>
					No conditions
				</div>
			);
		}

		const isNot = g.logic === "NOT";
		return (
			<div>
				<div className="mb-1">
					<GroupHeader count={g.expressions.length} depth={depth} logic={g.logic} />
				</div>
				<div className={conditionGroupLeftBorderColor(g.logic, "space-y-1 border-l pl-3")}>
					{g.expressions.map((c, idx) => {
						const childKey = keyForNode(c, idx);
						const showConnector = !isNot && idx > 0 && (g.logic === "AND" || g.logic === "OR");
						return (
							<div className="space-y-1" key={childKey}>
								{showConnector && (
									<div className="flex items-center gap-1 pl-0.5">
										<LogicPill logic={g.logic} />
									</div>
								)}
								{isGroup(c) ? <div className="pt-0.5">{renderGroup(c as ExpressionGroupType, depth + 1)}</div> : <FieldItem node={c as ExpressionNodeType} />}
							</div>
						);
					})}
					{isNot && g.expressions.length > 1 && (
						<div
							className="mt-1 rounded border border-dashed px-2 py-1 text-[10px] text-muted-foreground"
							title="NOT groups ideally contain a single expression"
						>
							NOT group contains multiple expressions
						</div>
					)}
				</div>
			</div>
		);
	}, []);

	const tree = useMemo(() => renderGroup(conditions, 0), [conditions, renderGroup]);
	return <div className={className ? `text-sm ${className}` : "text-sm"}>{tree}</div>;
};

export default ConditionTree;
