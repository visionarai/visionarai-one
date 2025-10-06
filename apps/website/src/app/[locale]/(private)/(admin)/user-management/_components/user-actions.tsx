"use client";
import { Button, useBetterAuthFunction } from "@visionarai-one/ui";
import { authClient } from "@/lib/auth-client";

// Placeholder for user actions - to be implemented later
type UserActionsProps = {
	userId: string;
};

export function UserActions({ userId }: UserActionsProps) {
	const { refetch } = authClient.useSession();
	const [impersonateUser] = useBetterAuthFunction(authClient.admin.impersonateUser, {
		loadingMessage: "Impersonating user...",
		onSuccess: () => {
			refetch();
		},

		successMessage: "Successfully impersonated user",
	});
	return (
		<div className="flex justify-end space-x-2">
			<Button onClick={() => impersonateUser({ userId })} variant="outline">
				Impersonate User
			</Button>
		</div>
	);
}
