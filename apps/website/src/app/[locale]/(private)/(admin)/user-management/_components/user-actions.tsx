"use client";
import { ActionButton, useBetterAuthFunction } from "@visionarai-one/ui";
import { UserCog, UserX } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { authClient, type User } from "@/lib/auth-client";

// Placeholder for user actions - to be implemented later
type UserActionsProps = {
	user: User;
};

export function UserActions({ user }: UserActionsProps) {
	const userId = user.id;
	const { refetch, data } = authClient.useSession();
	const selfId = data?.user?.id;
	const router = useRouter();

	const [impersonateUser] = useBetterAuthFunction(authClient.admin.impersonateUser, {
		loadingMessage: "Impersonating user...",
		onSuccess: () => {
			refetch();
			router.push("/dashboard");
		},
		successMessage: "Successfully impersonated user",
	});

	const [banUser] = useBetterAuthFunction(authClient.admin.banUser, {
		loadingMessage: "Banning user...",
		onSuccess: () => {
			router.refresh();
		},
		successMessage: "User has been banned",
	});

	const [unbanUser] = useBetterAuthFunction(authClient.admin.unbanUser, {
		loadingMessage: "Unbanning user...",
		onSuccess: () => {
			router.refresh();
		},
		successMessage: "User has been unbanned",
	});

	return (
		<div>
			<ActionButton aria-label="Impersonate User" buttonIcon={<UserCog />} onClick={() => impersonateUser({ userId })} size="icon" variant="ghost" />
			<ActionButton
				aria-label={user.banned ? "Unban User" : "Ban User"}
				buttonIcon={<UserX />}
				disabled={userId === selfId}
				onClick={() => (user.banned ? unbanUser({ userId }) : banUser({ userId }))}
				size="icon"
				variant="ghostDestructive"
			/>
		</div>
	);
}
