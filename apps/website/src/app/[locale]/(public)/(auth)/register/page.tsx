"use client";

import { FormRenderer, stringifyFieldMetadata, useBetterAuthFunction } from "@visionarai-one/ui";
import { getPasswordRequirements, passwordZod } from "@visionarai-one/utils";
import { RotateCcw, SendHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { z } from "zod/v4";
import { useRouter } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";

const formSchema = z
	// biome-ignore assist/source/useSortedKeys: For order in form
	.object({
		name: z
			.string()
			.min(2)
			.max(100)
			.describe(
				stringifyFieldMetadata({
					description: "Your full name",
					inputMode: "text",
					label: "Full Name",
					name: "name",
					placeholder: "Enter your full name",
					type: "text",
				})
			),
		email: z.email("Invalid email address").describe(
			stringifyFieldMetadata({
				autoComplete: "email",
				description: "We will never share your email with anyone else.",
				inputMode: "email",
				label: "Email",
				name: "email",
				placeholder: "Enter your email",
				type: "email",
			})
		),
		password: passwordZod.describe(
			stringifyFieldMetadata({
				description: "Your password must be at least 6 characters long.",
				label: "Password",
				name: "password",
				placeholder: "Enter your password",
				type: "password",
			})
		),
		confirmPassword: z.string().describe(
			stringifyFieldMetadata({
				description: "Please confirm your password.",
				label: "Confirm Password",
				name: "confirmPassword",
				placeholder: "Re-enter your password",
				type: "password-no",
			})
		),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export default function RegisterPage() {
	const router = useRouter();
	const passwordT = useTranslations("Auth.passwordRequirements");

	const passwordRequirements = getPasswordRequirements(passwordT);

	const [signin, { isLoading }] = useBetterAuthFunction(authClient.signUp.email, {
		loadingMessage: "Signing up...",
		onSuccess: () => {
			router.push("/policies");
		},
		successMessage: "Policy updated successfully",
	});

	return (
		<FormRenderer
			defaultValues={{ confirmPassword: "SuperSecured@2025", email: "er.sanyam.arya@gmail.com", name: "Sanyam Arya", password: "SuperSecured@2025" }}
			formSchema={formSchema}
			isLoading={isLoading}
			onSubmit={async (data) => {
				await signin({ callbackURL: "/", email: data.email, name: data.name, password: data.password });
			}}
			passwordRequirements={passwordRequirements}
			resetButtonIcon={<RotateCcw />}
			submitButtonIcon={<SendHorizontal />}
		/>
	);
}
