"use client";
import {
	ActionButton,
	Badge,
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	useBetterAuthFunction,
} from "@visionarai-one/ui";
import type { UserWithRole } from "better-auth/plugins/admin";
import { MoreHorizontal, User2Icon, UserCog, UserX } from "lucide-react";
import { useQueryStates } from "nuqs";
import { useRouter } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";
import { querySearchParams } from "../_state/search-params";
import { UserProfile } from "./user-profile";

type UserActionsProps = {
	user: UserWithRole;
};

export function UserActions({ user }: UserActionsProps) {
	const [{ selectedUserId, openUserProfile }, setParams] = useQueryStates(querySearchParams);
	const showDialog = openUserProfile && selectedUserId === user.id;
	const userId = user.id;
	const { refetch, data } = authClient.useSession();
	const selfId = data?.user?.id;
	const router = useRouter();

	const [impersonateUser] = useBetterAuthFunction(authClient.admin.impersonateUser, {
		loadingMessage: "Impersonating user...",
		onSuccess: () => {
			refetch();
			router.push("/dashboard");
			router.refresh();
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

	const [updateUser, { isLoading: isUpdatingUser }] = useBetterAuthFunction(authClient.admin.updateUser, {
		loadingMessage: "Updating user...",
		onSuccess: () => {
			setParams({ openUserProfile: false, selectedUserId: null });
		},
		successMessage: "User has been updated",
	});

	const [removeUser] = useBetterAuthFunction(authClient.admin.removeUser, {
		loadingMessage: "Deleting user...",
		onSuccess: () => {
			router.refresh();
		},
		successMessage: "User has been deleted",
	});

	if (selfId === userId) return <Badge>It's you!</Badge>;

	return (
		<div className="justify-end-safe flex items-center gap-2">
			<ActionButton aria-label="Impersonate User" buttonIcon={<UserCog />} onClick={() => impersonateUser({ userId })} size="icon" variant="ghost" />

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button size="icon" variant="ghost">
						<MoreHorizontal />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuLabel>Admin Actions</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem asChild>
						<ActionButton
							aria-label={user.emailVerified ? "Unverify Email" : "Verify Email"}
							buttonIcon={<UserCog />}
							className="w-full justify-start"
							labelAsText
							onClick={() => updateUser({ data: { emailVerified: !user.emailVerified }, userId })}
							showTooltip={false}
							variant="ghost"
						/>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<ActionButton
							aria-label={user.banned ? "Unban User" : "Ban User"}
							buttonIcon={<UserX />}
							className="w-full justify-start"
							labelAsText
							onClick={() => (user.banned ? unbanUser({ userId }) : banUser({ userId }))}
							showTooltip={false}
							variant="ghost"
						/>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<ActionButton
							aria-label="Remove User"
							buttonIcon={<UserX className="text-destructive" />}
							cancelButtonText="No, cancel"
							confirmButtonText="Yes, delete"
							confirmDialogDescription="This will permanently delete the user and all their data."
							confirmDialogTitle="Are you sure?"
							labelAsText
							onClick={() => removeUser({ userId })}
							requiresConfirmation
							showTooltip={false}
							variant="ghostDestructive"
						/>
					</DropdownMenuItem>
					<DropdownMenuItem
						aria-label="View Profile"
						onClick={() => {
							setParams({ openUserProfile: true, selectedUserId: user.id });
						}}
					>
						<User2Icon />
						View Profile
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			{showDialog && (
				<UserProfile
					isLoading={isUpdatingUser}
					onSaveAction={(updatedUserData) => {
						updateUser({ data: updatedUserData, userId: user.id });
					}}
					user={user}
				/>
			)}
		</div>
	);
}
