"use client";

import { ActionConfirmationButton, Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, useAsyncFunction } from "@visionarai-one/ui";
import { Clipboard, Copy, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { orpcClient } from "@/lib/orpc";

type PolicyActionsProps = {
	policyId: string;
	policyName: string;
};

export const PolicyActions = ({ policyId, policyName }: PolicyActionsProps) => {
	const router = useRouter();
	const t = useTranslations("PoliciesPage");

	const [deletePolicy] = useAsyncFunction(orpcClient.policies.removeById, {
		onSuccess: () => {
			router.refresh();
		},
		successMessage: "Policy deleted successfully",
	});

	const [duplicatePolicy] = useAsyncFunction(orpcClient.policies.duplicateById, {
		onSuccess: () => {
			router.refresh();
		},
		successMessage: "Policy duplicated successfully",
	});

	const handleCopy = async () => {
		try {
			if (typeof navigator === "undefined" || !navigator.clipboard) {
				throw new Error("Clipboard API not available");
			}
			await navigator.clipboard.writeText(policyId);
			toast.success(t("actions.copySuccess"), { description: policyName });
		} catch {
			toast.error(t("actions.copyError"));
		}
	};

	return (
		<TooltipProvider delayDuration={150}>
			<div className="flex items-center gap-1">
				<Tooltip>
					<TooltipTrigger asChild>
						<Button aria-label={t("actions.copyId")} onClick={handleCopy} size="icon" type="button" variant="ghost">
							<Clipboard aria-hidden className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="bottom">{t("actions.copyId")}</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button aria-label="Duplicate policy" onClick={() => duplicatePolicy(policyId)} size="icon" type="button" variant="ghost">
							<Copy aria-hidden className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="bottom">Duplicate policy</TooltipContent>
				</Tooltip>

				<ActionConfirmationButton
					actionButtonText={t("actions.delete.aria")}
					cancelButtonText={t("actions.delete.cancel")}
					confirmButtonText={t("actions.delete.confirm")}
					dialogDescription={t("actions.delete.description")}
					dialogTitle={t("actions.delete.title")}
					onConfirm={() => deletePolicy(policyId)}
					variant="destructive"
				>
					<Trash2 className="h-4 w-4" />
				</ActionConfirmationButton>
			</div>
		</TooltipProvider>
	);
};
