"use client";

import { ActionConfirmationButton, Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@visionarai-one/ui";
import { Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

type PolicyActionsProps = {
	policyId: string;
	policyName: string;
};

export const PolicyActions = ({ policyId, policyName }: PolicyActionsProps) => {
	const t = useTranslations("PoliciesPage");

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
				<ActionConfirmationButton
					actionButtonText={t("actions.delete.aria")}
					cancelButtonText={t("actions.delete.cancel")}
					confirmButtonText={t("actions.delete.confirm")}
					dialogDescription={t("actions.delete.description")}
					dialogTitle={t("actions.delete.title")}
					onConfirm={handleDelete}
				/>
			</div>
		</TooltipProvider>
	);
};
