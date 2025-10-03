"use client";

import { FormRenderer, stringifyFieldMetadata, useBetterAuthFunction } from "@visionarai-one/ui";
import { getPasswordRequirements, passwordZod } from "@visionarai-one/utils";
import { UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { z } from "zod/v4";
import { Link, useRouter } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
	const router = useRouter();
	const t = useTranslations("Auth.register");
	const passwordT = useTranslations("Auth.passwordRequirements");

	const passwordRequirements = getPasswordRequirements(passwordT);

	const [signup, { isLoading }] = useBetterAuthFunction(authClient.signUp.email, {
		loadingMessage: t("loadingMessage"),
		onSuccess: () => {
			router.push("/dashboard");
		},
		successMessage: t("successMessage"),
	});
	const formSchema = z
		// biome-ignore assist/source/useSortedKeys: For the right order of fields
		.object({
			name: z
				.string()
				.min(2, t("nameMinError"))
				.max(100, t("nameMaxError"))
				.describe(
					stringifyFieldMetadata({
						inputMode: "text",
						label: t("nameLabel"),
						name: "name",
						placeholder: t("namePlaceholder"),
						type: "text",
					})
				),
			email: z.email(t("emailError")).describe(
				stringifyFieldMetadata({
					inputMode: "email",
					label: t("emailLabel"),
					name: "email",
					placeholder: t("emailPlaceholder"),
					type: "email",
				})
			),

			password: passwordZod.describe(
				stringifyFieldMetadata({
					label: t("passwordLabel"),
					name: "password",
					placeholder: t("passwordPlaceholder"),
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
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: t("passwordMismatchError"),
			path: ["confirmPassword"],
		});
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="space-y-2 text-center">
				<h1 className="font-bold text-3xl tracking-tight">{t("title")}</h1>
				<p className="text-muted-foreground text-sm">{t("subtitle")}</p>
			</div>

			{/* Register Form */}
			<FormRenderer
				formSchema={formSchema}
				isLoading={isLoading}
				onSubmit={async (data) => {
					await signup({ callbackURL: "/dashboard", email: data.email, name: data.name, password: data.password });
				}}
				passwordRequirements={passwordRequirements}
				submitButtonIcon={<UserPlus />}
				submitButtonText={t("submit")}
			/>

			{/* Login CTA */}
			<div className="pt-4 text-center text-sm">
				<span className="text-muted-foreground">{t("haveAccount")} </span>
				<Link className="font-medium text-primary underline-offset-4 hover:underline" href="/login">
					{t("loginLink")}
				</Link>
			</div>
		</div>
	);
}
