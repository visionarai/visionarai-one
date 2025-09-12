"use client";
import { usePolicyEditor } from "./policy-editor-context";

// Placeholder master data; later fetch or pass via props
const resources: { resource: string; actions: string[] }[] = [{ actions: ["read", "write"], resource: "document" }];

const decisionOptions: { value: "allow" | "deny" | "conditional"; label: string }[] = [
	{ label: "Allow", value: "allow" },
	{ label: "Deny", value: "deny" },
	{ label: "Conditional", value: "conditional" },
];

export function PermissionMatrix() {
	const { draft, setPermission } = usePolicyEditor();
	return (
		<div className="space-y-4">
			{resources.map((r) => (
				<div className="rounded border p-3" key={r.resource}>
					<h3 className="mb-2 font-medium">Resource: {r.resource}</h3>
					<table className="w-full border-collapse text-sm">
						<thead>
							<tr className="text-left">
								<th className="p-1">Action</th>
								<th className="p-1">Decision</th>
								<th className="p-1">Condition</th>
							</tr>
						</thead>
						<tbody>
							{r.actions.map((action) => {
								const decision = draft.permissions[r.resource]?.[action];
								return (
									<tr className="border-t" key={action}>
										<td className="p-1 font-mono">{action}</td>
										<td className="p-1">
											<select
												className="rounded border px-2 py-1"
												onChange={(e) => {
													const value = e.target.value as "allow" | "deny" | "conditional";
													setPermission(r.resource, action, value === "conditional" ? { root: null, type: "conditional" } : { type: value });
												}}
												value={decision?.type || "deny"}
											>
												{decisionOptions.map((opt) => (
													<option key={opt.value} value={opt.value}>
														{opt.label}
													</option>
												))}
											</select>
										</td>
										<td className="p-1">
											{decision?.type === "conditional" ? (
												decision.root ? (
													<button className="text-blue-600 underline" type="button">
														{decision.root}
													</button>
												) : (
													<button
														className="rounded border px-2 py-1 text-xs"
														onClick={() => setPermission(r.resource, action, { root: "__pick__", type: "conditional" })}
														type="button"
													>
														Attach Condition
													</button>
												)
											) : (
												<span className="text-muted">—</span>
											)}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			))}
		</div>
	);
}
