"use client";

import type { PermissionType } from "@visionarai-one/abac";
import { Badge, Button, Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@visionarai-one/ui";
import { ChevronRight, Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import { PermissionForm } from "../_permission_form";

type PermissionEditorProps = {
	action: string;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	permission: PermissionType;
	policyId: string;
	resource: string;
};

export const PermissionEditor = ({ action, isOpen, onOpenChange, permission, policyId, resource }: PermissionEditorProps) => {
	const t = useTranslations("PoliciesPage.permissionEditor");

	return (
		<Sheet onOpenChange={onOpenChange} open={isOpen}>
			<SheetContent className="w-screen sm:max-w-4xl lg:max-w-5xl" side="right">
				<SheetHeader className="space-y-3">
					<div className="flex items-center gap-2">
						<Settings className="h-5 w-5 text-muted-foreground" />
						<SheetTitle>{t("title")}</SheetTitle>
					</div>
					<SheetDescription>{t("description")}</SheetDescription>
					<div className="flex items-center gap-2 text-sm">
						<Badge variant="secondary">{resource}</Badge>
						<ChevronRight className="h-3 w-3 text-muted-foreground" />
						<Badge variant="secondary">{action}</Badge>
					</div>
				</SheetHeader>

				<div className="my-6 h-[calc(100vh-240px)] overflow-y-auto">
					<PermissionForm action={action} id={policyId} onSuccess={() => onOpenChange(false)} permission={permission} resource={resource} />
				</div>

				<SheetFooter className="gap-2">
					<SheetClose asChild>
						<Button className="flex-1" variant="outline">
							{t("cancelButton")}
						</Button>
					</SheetClose>
					<Button className="flex-1" form="permission-form" type="submit">
						{t("saveButton")}
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
};
