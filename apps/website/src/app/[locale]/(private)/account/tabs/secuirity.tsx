"use client";
import { FormRenderer, stringifyFieldMetadata } from "@visionarai-one/ui";
import { getPasswordRequirements, passwordZod } from "@visionarai-one/utils";
import { useTranslations } from "next-intl";
import { z } from "zod";

export function SecurityTab({ hasPasswordAccount }: { hasPasswordAccount?: boolean }) {
	const passwordT = useTranslations("Auth.passwordRequirements");
	const t = useTranslations("Account.tabs.security");

	const passwordRequirements = getPasswordRequirements(passwordT);

	const changePasswordSchema = z
		// biome-ignore assist/source/useSortedKeys: For the right order of fields
		.object({
			currentPassword: passwordZod.describe(
				stringifyFieldMetadata({
					label: t("currentPasswordLabel"),
					name: "currentPassword",
					placeholder: t("currentPasswordPlaceholder"),
					type: "password-no",
				})
			),
			newPassword: passwordZod.describe(
				stringifyFieldMetadata({
					label: t("newPasswordLabel"),
					name: "newPassword",
					placeholder: t("newPasswordPlaceholder"),
					type: "password",
				})
			),
			confirmPassword: z.string().describe(
				stringifyFieldMetadata({
					label: t("confirmPasswordLabel"),
					name: "confirmPassword",
					placeholder: t("confirmPasswordPlaceholder"),
					type: "password-no",
				})
			),
			revokeOtherSessions: z.boolean().describe(
				stringifyFieldMetadata({
					description: t("revokeOtherSessionsDescription"),
					label: t("revokeOtherSessionsLabel"),
					name: "revokeOtherSessions",
					type: "switch",
				})
			),
		})
		.refine((data) => data.newPassword === data.confirmPassword, {
			message: t("passwordMismatchError"),
			path: ["confirmPassword"],
		});

	if (hasPasswordAccount) {
		return (
			<section aria-labelledby="change-password" className="space-y-8">
				<h3 className="mb-4 font-bold text-xl">{t("changePasswordHeading")}</h3>
				<FormRenderer
					defaultValues={{
						revokeOtherSessions: true,
					}}
					formSchema={changePasswordSchema}
					onSubmit={(data) => {
						alert(JSON.stringify(data, null, 2));
					}}
					passwordRequirements={passwordRequirements}
				/>
			</section>
		);
	}
	return <div>{t("comingSoon")}</div>;
}
