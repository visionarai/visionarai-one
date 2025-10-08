"use client";

import { FormRenderer, stringifyFieldMetadata } from "@visionarai-one/ui";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";

const profileUpdateSchema = z.object({
	email: z
		.email()
		.min(1)
		.describe(
			stringifyFieldMetadata({
				autoComplete: "email",
				description: "A valid email address is required.",
				inputMode: "email",
				label: "Email",
				name: "email",
				placeholder: "Enter your email address",
				type: "email",
			})
		),
	name: z
		.string()
		.min(1)
		.describe(
			stringifyFieldMetadata({
				description: "Your full name.",
				label: "Name",
				name: "name",
				placeholder: "Enter your full name",
				type: "text",
			})
		),
});

type ProfileUpdateForm = z.infer<typeof profileUpdateSchema>;

export default function ProfileTab({ user }: { user: ProfileUpdateForm }) {
	const router = useRouter();
	async function handleProfileUpdate(data: ProfileUpdateForm) {
		const promises = [
			authClient.updateUser({
				name: data.name,
			}),
		];

		if (data.email !== user.email) {
			promises.push(
				authClient.changeEmail({
					callbackURL: "/profile",
					newEmail: data.email,
				})
			);
		}

		const res = await Promise.all(promises);

		const updateUserResult = res[0];
		const emailResult = res[1] ?? { error: false };

		if (updateUserResult.error) {
			toast.error(updateUserResult.error.message || "Failed to update profile");
		} else if (emailResult.error) {
			toast.error(emailResult.error.message || "Failed to change email");
		} else if (data.email !== user.email) {
			toast.success("Verify your new email address to complete the change.");
		} else {
			toast.success("Profile updated successfully");
		}
		router.refresh();
	}
	return (
		<div>
			<FormRenderer
				defaultValues={user}
				formSchema={profileUpdateSchema}
				onSubmit={handleProfileUpdate}
				submitButtonIcon={<Save />}
				submitButtonText="Save Changes"
			/>
		</div>
	);
}
