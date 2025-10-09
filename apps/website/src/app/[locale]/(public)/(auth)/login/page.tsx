"use client";

import { Button, FormRenderer, LoadingSwap, Separator, stringifyFieldMetadata, useBetterAuthFunction } from "@visionarai-one/ui";
import { passwordZod } from "@visionarai-one/utils";
import { LogIn } from "lucide-react";
import { useTranslations } from "next-intl";
import { z } from "zod/v4";
import { Link, useRouter } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";
import { SUPPORTED_OAUTH_PROVIDER_DETAILS, SUPPORTED_OAUTH_PROVIDERS } from "@/lib/o-auth-providers";

export default function LoginPage() {
	const router = useRouter();
	const t = useTranslations("Auth.login");

	const formSchema = z.object({
		email: z.email(t("emailError")).describe(
			stringifyFieldMetadata({
				autoComplete: "email",
				description: t("emailDescription"),
				inputMode: "email",
				label: t("emailLabel"),
				name: "email",
				placeholder: t("emailPlaceholder"),
				type: "email",
			})
		),
		password: passwordZod.describe(
			stringifyFieldMetadata({
				description: t("passwordDescription"),
				label: t("passwordLabel"),
				name: "password",
				placeholder: t("passwordPlaceholder"),
				type: "password",
			})
		),
	});

	const [signin, { isLoading }] = useBetterAuthFunction(authClient.signIn.email, {
		loadingMessage: t("loadingMessage"),
		onSuccess: () => {
			router.push("/dashboard");
		},
		successMessage: t("successMessage"),
	});
	const [socialLogin, { isLoading: isLoadingSocial }] = useBetterAuthFunction(authClient.signIn.social, {
		loadingMessage: t("loadingMessage"),
		onSuccess: () => {
			router.push("/dashboard");
		},
		successMessage: t("successMessage"),
	});

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="space-y-2 text-center">
				<h1 className="font-bold text-3xl tracking-tight">{t("title")}</h1>
				<p className="text-muted-foreground text-sm">{t("subtitle")}</p>
			</div>

			{/* Form */}
			<div className="space-y-4">
				<FormRenderer
					formSchema={formSchema}
					isLoading={isLoading}
					onSubmit={async (data) => {
						await signin({ callbackURL: "/dashboard", email: data.email, password: data.password });
					}}
					submitButtonIcon={<LogIn />}
					submitButtonText={t("submit")}
				/>
				<Separator className="my-8" />

				{SUPPORTED_OAUTH_PROVIDERS.map((provider) => {
					const { Icon, signInKey } = SUPPORTED_OAUTH_PROVIDER_DETAILS[provider];

					return (
						<Button className="w-full" disabled={isLoadingSocial} key={provider} onClick={() => socialLogin({ provider })} size="lg" variant="outline">
							<LoadingSwap isLoading={isLoadingSocial}>
								<Icon height={24} width={24} />
							</LoadingSwap>
							{t(signInKey)}
						</Button>
					);
				})}

				<Button asChild className="w-full" disabled={isLoading} size="lg" variant="link">
					<Link href="/forgot-password">{t("forgotPassword")}</Link>
				</Button>
			</div>

			{/* Register CTA */}
			<div className="pt-4 text-center text-sm">
				<span className="text-muted-foreground">{t("noAccount")} </span>
				<Link className="font-medium text-primary underline-offset-4 hover:underline" href="/register">
					{t("registerLink")}
				</Link>
			</div>
		</div>
	);
}
