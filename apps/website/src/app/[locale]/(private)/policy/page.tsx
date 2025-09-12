"use client";
import { NodeLibrary } from "./_components/node-library";
import { PermissionMatrix } from "./_components/permission-matrix";
import { PolicyEditorProvider } from "./_components/policy-editor-context";

export default function PolicyPage() {
	return (
		<div className="space-y-6 p-6">
			<h1 className="font-semibold text-2xl">Policy Editor (Prototype)</h1>
			<PolicyEditorProvider>
				<div className="grid gap-6 md:grid-cols-3">
					<div className="space-y-6 md:col-span-2">
						<PermissionMatrix />
					</div>
					<div className="space-y-4">
						<h2 className="font-medium text-lg">Condition Nodes</h2>
						<NodeLibrary />
					</div>
				</div>
			</PolicyEditorProvider>
		</div>
	);
}
