"use client";

import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@visionarai-one/ui";
import { Copy, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

type PolicyActionsProps = {
	policyId: string;
	policyName: string;
};

export const PolicyActions = ({ policyId, policyName }: PolicyActionsProps) => {
	const t = useTranslations("PoliciesPage");
	const [dialogOpen, setDialogOpen] = useState(false);

	const handleCopy = async () => {
		try {
			if (typeof navigator === "undefined" || !navigator.clipboard) {
				throw new Error("Clipboard API not available");
			}
			await navigator.clipboard.writeText(policyId);
			toast.success(t("actions.copySuccess"), { description: policyName });
		} catch (_error) {
			toast.error(t("actions.copyError"));
		}
	};

	const handleDelete = () => {
		setDialogOpen(false);
		toast.info(t("actions.delete.pending"), { description: policyName });
	};

	return (
		<TooltipProvider delayDuration={150}>
			<div className="flex items-center gap-2">
				<Tooltip>
					<TooltipTrigger asChild>
						<Button aria-label={t("actions.copyId")} onClick={handleCopy} size="icon" type="button" variant="ghost">
							<Copy aria-hidden className="h-4 w-4" />
							<span className="sr-only">{t("actions.copyId")}</span>
						</Button>
					</TooltipTrigger>
					<TooltipContent side="bottom">{t("actions.copyId")}</TooltipContent>
				</Tooltip>
				<Dialog onOpenChange={setDialogOpen} open={dialogOpen}>
					<Tooltip>
						<TooltipTrigger asChild>
							<DialogTrigger asChild>
								<Button aria-label={t("actions.delete.aria")} size="icon" type="button" variant="ghost">
									<Trash2 aria-hidden className="h-4 w-4" />
									<span className="sr-only">{t("actions.delete.aria")}</span>
								</Button>
							</DialogTrigger>
						</TooltipTrigger>
						<TooltipContent side="bottom">{t("actions.delete.aria")}</TooltipContent>
					</Tooltip>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>{t("actions.delete.title")}</DialogTitle>
							<DialogDescription>{t("actions.delete.description")}</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button onClick={() => setDialogOpen(false)} type="button" variant="outline">
								{t("actions.delete.cancel")}
							</Button>
							<Button onClick={handleDelete} type="button" variant="destructive">
								{t("actions.delete.confirm")}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</TooltipProvider>
	);
};
