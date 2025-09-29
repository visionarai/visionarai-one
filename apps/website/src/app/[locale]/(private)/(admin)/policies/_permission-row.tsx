"use client";

import type { PermissionType } from "@visionarai-one/abac";
import {
	Badge,
	Button,
	Separator,
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTrigger,
	TableCell,
	TableRow,
} from "@visionarai-one/ui";
import { ChevronRight, Circle, Edit3, Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { decisionBorderColor } from "./_colors";
import { ConditionTree } from "./_condition-tree";
import { PermissionForm } from "./_permission_form";

type PermissionRowSheetProps = React.ComponentPropsWithoutRef<"div"> & {
	id: string;
	resource: string;
	action: string;
	permission: PermissionType;
};

function PermissionEditorSheet({ action, permission, resource, id }: PermissionRowSheetProps) {
	const [sheetOpen, setSheetOpen] = useState(false);
	const t = useTranslations("PoliciesPage.permissionEditor");

	return (
		<Sheet onOpenChange={setSheetOpen} open={sheetOpen}>
			<SheetTrigger asChild>
				<Button aria-label={t("editButton", { action })} className="hover:bg-accent hover:text-accent-foreground" size="icon" variant="outline">
					<Edit3 className="h-4 w-4" />
				</Button>
			</SheetTrigger>
			<SheetContent className="w-screen lg:w-[calc(100vw-160px)]" side="right">
				<SheetHeader className="border-2">
					<div className="flex items-center gap-2">
						<Settings className="h-5 w-5 text-muted-foreground" />
						<h3 className="font-semibold text-lg">Permission Configuration</h3>
					</div>
					<div className="flex items-center gap-2 text-muted-foreground text-sm">
						<span>Policy ID:</span>
						<code className="rounded bg-muted px-2 py-1 font-mono text-xs">{id}</code>
					</div>
					<SheetDescription className="text-sm leading-relaxed">{t("description")}</SheetDescription>
					<div className="flex items-center gap-2">
						<Badge className="font-medium" variant="secondary">
							{resource}
						</Badge>
						<ChevronRight className="h-3 w-3 text-muted-foreground" />
						<Badge className="font-medium" variant="secondary">
							{action}
						</Badge>
					</div>
				</SheetHeader>

				<div className="h-full overflow-y-auto px-4 py-2">
					<PermissionForm action={action} id={id} onSuccess={() => setSheetOpen(false)} permission={permission} resource={resource} />
				</div>
				<Separator />

				<SheetFooter className="flex w-full flex-row gap-3">
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
}

export function PermissionRow({ action, permission, resource, id }: PermissionRowSheetProps) {
	return (
		<TableRow className="[&_td]:py-4 [&_td]:align-top" key={action}>
			<TableCell className="font-medium">{action}</TableCell>
			<TableCell>
				<Badge className={decisionBorderColor(permission.decision)} variant="outline">
					<Circle /> {permission.decision}
				</Badge>
			</TableCell>
			<TableCell>{permission.decision === "CONDITIONAL" ? <ConditionTree conditions={permission.condition} /> : "-"}</TableCell>
			<TableCell className="sticky right-0 z-10 text-right">
				<PermissionEditorSheet action={action} id={id} permission={permission} resource={resource} />
			</TableCell>
		</TableRow>
	);
}
