import { cn } from "@visionarai-one/utils";
import { useState } from "react";
import { INDENT, isExpandable, type NodeProps, previewValue } from "../utils/tree-helpers";

function LeafNode({ value, name, depth }: NodeProps & { depth: number }) {
	const paddingLeft = depth * INDENT;
	return (
		<div className="leading-snug" style={{ paddingLeft }}>
			{name !== undefined && (
				<span className="text-blue-400">
					{typeof name === "number" ? name : JSON.stringify(String(name))}
					<span className="text-foreground">: </span>
				</span>
			)}
			<span
				className={cn(
					typeof value === "string" && "text-green-400",
					typeof value === "number" && "text-orange-400",
					typeof value === "boolean" && "text-purple-400",
					value === null && "text-gray-400 italic"
				)}
			>
				{previewValue(value)}
			</span>
		</div>
	);
}

function BranchNode({ value, name, depth }: NodeProps & { depth: number }) {
	const [collapsed, setCollapsed] = useState(depth > 4);
	const paddingLeft = depth * INDENT;
	const entries = Array.isArray(value) ? (value as unknown[]) : Object.entries(value as Record<string, unknown>);
	const openSymbol = Array.isArray(value) ? "[" : "{";
	const closeSymbol = Array.isArray(value) ? "]" : "}";
	return (
		<div className="leading-snug" style={{ paddingLeft }}>
			<button
				aria-label={collapsed ? "Expand" : "Collapse"}
				className={cn("mr-1 inline-flex h-4 w-4 items-center justify-center rounded border border-border bg-muted text-xs", collapsed && "opacity-70")}
				onClick={() => setCollapsed((c) => !c)}
				type="button"
			>
				{collapsed ? "+" : "−"}
			</button>
			{name !== undefined && (
				<span className="text-blue-400">
					{typeof name === "number" ? name : JSON.stringify(String(name))}
					<span className="text-foreground">: </span>
				</span>
			)}
			<span className="text-gray-400">{openSymbol}</span>
			{collapsed ? (
				<span className="text-gray-400"> … {closeSymbol}</span>
			) : (
				<>
					<div className="mt-1" />
					{entries.map((entry, idx) => {
						const key = Array.isArray(value) ? idx : (entry as [string, unknown])[0];
						const val = Array.isArray(value) ? entry : (entry as [string, unknown])[1];
						return <TreeNode depth={depth + 1} key={key} name={key} value={val} />;
					})}
					<div style={{ paddingLeft: depth * INDENT }}>
						<span className="text-gray-400">{closeSymbol}</span>
					</div>
				</>
			)}
		</div>
	);
}

function TreeNode(props: NodeProps & { depth?: number }) {
	const { value, depth = 0 } = props;
	if (!isExpandable(value)) {
		return <LeafNode {...props} depth={depth} />;
	}
	return <BranchNode {...props} depth={depth} />;
}

export type TreeViewProps = {
	data: unknown;
};

export const TreeView = ({ data }: TreeViewProps) => {
	return (
		<div className="space-y-0.5">
			<TreeNode value={data} />
		</div>
	);
};
