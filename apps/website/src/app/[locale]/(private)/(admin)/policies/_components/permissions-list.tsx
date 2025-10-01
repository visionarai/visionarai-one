"use client";

import type { PermissionType } from "@visionarai-one/abac";
import { Badge } from "@visionarai-one/ui";
import { useTranslations } from "next-intl";
import { PermissionItem } from "./permission-item";

type PermissionsListProps = {
	policyId: string;
	resource: string;
	resourcePermissions: Record<string, PermissionType>;
};

export const PermissionsList = ({ policyId, resource, resourcePermissions }: PermissionsListProps) => {
	const t = useTranslations("PoliciesPage");
	const actionCount = Object.keys(resourcePermissions ?? {}).length;

	return (
		<div className="space-y-2">
			<div className="flex items-center gap-2">
				<Badge className="font-mono text-xs" variant="outline">
					{resource}
				</Badge>
				<span className="text-muted-foreground text-xs">{t("table.actionsCount", { count: actionCount })}</span>
			</div>

			<div className="space-y-1">
				{Object.entries(resourcePermissions ?? {}).map(([action, permission]) => (
					<PermissionItem action={action} key={action} permission={permission} policyId={policyId} resource={resource} />
				))}
			</div>
		</div>
	);
};
