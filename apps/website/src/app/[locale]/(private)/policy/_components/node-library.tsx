"use client";
import { usePolicyEditor } from "./policy-editor-context";

export function NodeLibrary() {
	const { draft } = usePolicyEditor();
	const nodes = draft.nodeOrder.map((id) => draft.nodes[id]);
	if (!nodes.length) {
		return <div className="text-muted text-sm">No condition nodes yet.</div>;
	}
	return (
		<div className="space-y-2">
			{nodes.map((n) => (
				<div className="rounded border px-2 py-1 font-mono text-xs" key={n.id}>
					{n.id}: {n.label || "(unlabeled)"}
				</div>
			))}
		</div>
	);
}
