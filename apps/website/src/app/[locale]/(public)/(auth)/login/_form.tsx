"use client";

import { FormRenderer, stringifyFieldMetadata, useBetterAuthFunction } from "@visionarai-one/ui";
import { passwordZod } from "@visionarai-one/utils";
import { RotateCcw, SendHorizontal } from "lucide-react";
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
	});

export function LoginForm() {
	const router = useRouter();

	const [signin, { isLoading }] = useBetterAuthFunction(authClient.signIn.email, {
		loadingMessage: "Signing in...",
		onSuccess: () => {
			router.push("/policies");
		},
		successMessage: "Signed in successfully",
	});

	return (
		<FormRenderer
			defaultValues={{ email: "er.sanyam.arya@gmail.com", name: "Sanyam Arya", password: "SuperSecured@2025" }}
			formSchema={formSchema}
			isLoading={isLoading}
			onSubmit={async (data) => {
				await signin({ callbackURL: "/policies", email: data.email, password: data.password });
			}}
			resetButtonIcon={<RotateCcw />}
			submitButtonIcon={<SendHorizontal />}
		/>
	);
}
