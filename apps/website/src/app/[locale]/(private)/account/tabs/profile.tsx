"use client";

import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage, FormRenderer, stringifyFieldMetadata, useBetterAuthFunction } from "@visionarai-one/ui";
import { Save, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";

type ProfileUpdateForm = {
	name: string;
	email: string;
};

export default function ProfileTab() {
	const { refetch, data } = authClient.useSession();
	const router = useRouter();
	const user = data?.user;
	const t = useTranslations("Account.tabs.profile");

	const [updateUser, { isLoading }] = useBetterAuthFunction(authClient.updateUser, {
		errorMessage: t("errors.updateProfile"),
		loadingMessage: t("messages.processing"),
		onSuccess: () => {
			refetch();
			router.refresh();
		},
		successMessage: t("messages.profileUpdated"),
	});

	const [changeEmail] = useBetterAuthFunction(authClient.changeEmail, {
		errorMessage: t("errors.changeEmail"),
		loadingMessage: t("messages.processing"),
		onSuccess: () => {
			refetch();
			router.refresh();
		},
		successMessage: t("messages.verifyEmail"),
	});

	if (!user || user === undefined) return null;
	// biome-ignore assist/source/useSortedKeys: Need to preserve key order
	const profileUpdateSchema = z.object({
		name: z
			.string()
			.min(1)
			.describe(
				stringifyFieldMetadata({
					description: t("nameDescription"),
					label: t("fullNameLabel"),
					name: "name",
					type: "text",
				})
			),
		email: z
			.email()
			.min(1)
			.describe(
				stringifyFieldMetadata({
					autoComplete: "email",
					description: t("emailDescription"),
					disabled: true,
					inputMode: "email",
					label: t("emailLabel"),
					name: "email",
					type: "email",
				})
			),
	});

	function handleProfileUpdate(profileUpdateData: ProfileUpdateForm) {
		updateUser({
			name: profileUpdateData.name,
		});

		if (profileUpdateData.email !== user?.email) {
			changeEmail({
				callbackURL: "/profile",
				newEmail: profileUpdateData.email,
			});
		}
	}
	return (
		<section className="flex flex-row items-center gap-6">
			<FormRenderer
				className="flex-1"
				defaultValues={user}
				formSchema={profileUpdateSchema}
				isLoading={isLoading}
				onSubmit={handleProfileUpdate}
				submitButtonIcon={<Save />}
				submitButtonText={t("submitButton")}
			/>
			<Avatar className="flex-1 rounded-lg bg-muted">
				<AvatarImage alt={user.name || t("avatarFallback")} src={user.image || undefined} />
				<AvatarFallback>
					<User size={128} />
				</AvatarFallback>
			</Avatar>
		</section>
	);
}
