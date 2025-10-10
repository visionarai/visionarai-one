"use client";

import { ActionButton } from "@visionarai-one/ui";
import { useTranslations } from "next-intl";

export function DangerZoneTab() {
	const t = useTranslations("Account.tabs.danger");

	return (
		<ActionButton onClick={() => alert("Delete account")} variant="destructive">
			{t("deleteAccountButton")}
		</ActionButton>
	);
}
