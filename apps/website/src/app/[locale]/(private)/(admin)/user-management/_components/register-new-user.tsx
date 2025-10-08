"use client";

import { ActionButton, useBetterAuthFunction } from "@visionarai-one/ui";
import { UserPlus2 } from "lucide-react";
import { useQueryStates } from "nuqs";
import { authClient } from "@/lib/auth-client";
import { querySearchParams } from "../_state/search-params";
import { UserProfile } from "./user-profile";

export function RegisterNewUser() {
	const [{ selectedUserId }, setParams] = useQueryStates(querySearchParams);
	const [createUser, { isLoading: isCreating }] = useBetterAuthFunction(authClient.admin.createUser, {
		loadingMessage: "Creating user...",
		onSuccess: () => {
			setParams({ openUserProfile: false, selectedUserId: null });
		},

		successMessage: "User has been created",
	});

	return (
		<>
			<ActionButton
				aria-label="Register New User"
				buttonIcon={<UserPlus2 />}
				labelAsText
				onClick={() => {
					setParams({ openUserProfile: true, selectedUserId: null });
				}}
				showTooltip={false}
				variant="default"
			/>
			{!selectedUserId && (
				<UserProfile
					isLoading={isCreating}
					onSaveAction={(createdUserData) => {
						createUser({
							email: createdUserData.email,
							name: createdUserData.name,
							password: createdUserData.password as string,
						});
					}}
					user={null}
				/>
			)}
		</>
	);
}
