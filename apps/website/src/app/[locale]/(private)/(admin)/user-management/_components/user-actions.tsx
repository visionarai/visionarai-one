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
import { MoreHorizontal, UserCog, UserX } from "lucide-react";
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

	const [updateUser] = useBetterAuthFunction(authClient.admin.updateUser, {
		loadingMessage: "Updating user...",
		onSuccess: () => {
			router.refresh();
		},
		successMessage: "User has been updated",
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
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
