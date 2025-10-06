"use client";

import { ActionButton, TooltipProvider, useAsyncFunction } from "@visionarai-one/ui";
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
				<ActionButton aria-label={t("actions.copyId")} buttonIcon={<Clipboard />} onClick={handleCopy} size="icon" variant="ghost" />
				<ActionButton aria-label="Duplicate policy" buttonIcon={<Copy />} onClick={() => duplicatePolicy(policyId)} size="icon" variant="ghost" />
				<ActionButton
					aria-label={t("actions.delete.aria")}
					buttonIcon={<Trash2 />}
					cancelButtonText={t("actions.delete.cancel")}
					confirmButtonText={t("actions.delete.confirm")}
					confirmDialogDescription={t("actions.delete.description")}
					confirmDialogTitle={t("actions.delete.title")}
					onClick={() => deletePolicy(policyId)}
					requiresConfirmation
					size="icon"
					variant="ghostDestructive"
				/>
			</div>
		</TooltipProvider>
	);
};
