"use client";

import type { PermissionType } from "@visionarai-one/abac";
import { Badge, Button } from "@visionarai-one/ui";
import { CheckCircle2, Edit3, ShieldAlert, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { ConditionTree } from "./condition-tree";
import { PermissionEditor } from "./permission-editor";
import { decisionBorderColor } from "./utils";

type PermissionItemProps = {
	action: string;
	permission: PermissionType;
	policyId: string;
	resource: string;
};

const DecisionIcon = ({ decision }: { decision: PermissionType["decision"] }) => {
	switch (decision) {
		case "ALLOW":
			return <ShieldCheck className="h-3.5 w-3.5" />;
		case "DENY":
			return <ShieldAlert className="h-3.5 w-3.5" />;
		case "CONDITIONAL":
			return <CheckCircle2 className="h-3.5 w-3.5" />;
		default:
			return <ShieldCheck className="h-3.5 w-3.5" />;
	}
};

export const PermissionItem = ({ action, permission, policyId, resource }: PermissionItemProps) => {
	const [isEditorOpen, setIsEditorOpen] = useState(false);

	return (
		<>
			<div className="group flex items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2 transition-colors hover:bg-accent/50">
				<div className="flex min-w-0 flex-1 items-center gap-3">
					<span className="shrink-0 font-medium text-sm">{action}</span>
					<Badge className={decisionBorderColor(permission.decision, "shrink-0 gap-1")} variant="outline">
						<DecisionIcon decision={permission.decision} />
						<span className="text-xs">{permission.decision}</span>
					</Badge>

					{permission.decision === "CONDITIONAL" && permission.condition ? (
						<div className="min-w-0 flex-1">
							<ConditionTree conditions={permission.condition} />
						</div>
					) : null}
				</div>

				<Button
					aria-label={`Edit ${action} permission`}
					className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
					onClick={() => setIsEditorOpen(true)}
					size="sm"
					variant="ghost"
				>
					<Edit3 className="h-3.5 w-3.5" />
				</Button>
			</div>

			<PermissionEditor action={action} isOpen={isEditorOpen} onOpenChange={setIsEditorOpen} permission={permission} policyId={policyId} resource={resource} />
		</>
	);
};
