"use client";
import { FormRenderer, Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, stringifyFieldMetadata } from "@visionarai-one/ui";
import { getPasswordRequirements, passwordZod } from "@visionarai-one/utils";
import type { UserWithRole } from "better-auth/plugins/admin";
import { Save } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryStates } from "nuqs";
import { z } from "zod";
import { querySearchParams } from "../_state/search-params";

const AllRoles = [
	{ label: "User", value: "regular" },
	{ label: "Admin", value: "admin" },
];

type Role = "regular" | "admin";

export type UserProfileInput = {
	banned?: boolean | unknown;
	email: string;
	emailVerified?: boolean | unknown;
	name: string;
	role?: Role | unknown;
	password?: string | unknown;
};

type UserProfileProps = {
	user: UserWithRole | null;
	onSaveAction: (data: UserProfileInput) => void;
	isLoading?: boolean;
};

export function UserProfile({ user, onSaveAction, isLoading = false }: UserProfileProps) {
	const passwordT = useTranslations("Auth.passwordRequirements");

	const passwordRequirements = getPasswordRequirements(passwordT);

	// biome-ignore assist/source/useSortedKeys: We want to keep the keys in this order
	const userProfileInputSchema = z.object({
		name: z
			.string()
			.min(1, "Name is required")
			.describe(
				stringifyFieldMetadata({
					description: "The user's full name.",
					label: "Name",
					name: "name",
					placeholder: "Enter full name of the user",
					type: "text",
				})
			),
		email: z.email("Invalid email address").describe(
			stringifyFieldMetadata({
				autoComplete: "email",
				description: "A valid email address is required.",
				inputMode: "email",
				label: "Email",
				name: "email",
				placeholder: "Enter email address",
				type: "email",
			})
		),
		...(user === null && {
			password: passwordZod.describe(
				stringifyFieldMetadata({
					label: "Password",
					name: "password",
					placeholder: "Enter a password for the user",
					type: "password",
				})
			),
		}),
		...(user != null && {
			role: z.enum(["regular", "admin"]).describe(
				stringifyFieldMetadata({
					description: "The user's role.",
					label: "Role",
					name: "role",
					options: AllRoles,
					type: "choice",
				})
			),
		}),
		...(user != null && {
			banned: z.boolean().describe(
				stringifyFieldMetadata({
					description: "Whether the user is banned or not.",
					label: "Banned",
					name: "banned",
					type: "switch",
				})
			),
		}),
		...(user != null && {
			emailVerified: z.boolean().describe(
				stringifyFieldMetadata({
					description: "Whether the user's email is verified or not.",
					label: "Email Verified",
					name: "emailVerified",
					type: "switch",
				})
			),
		}),
	});

	const [{ openUserProfile }, setParams] = useQueryStates(querySearchParams);

	const defaultValues: UserProfileInput = {
		banned: !!user?.banned,
		email: user?.email || "",
		emailVerified: !!user?.emailVerified,
		name: user?.name || "",
		password: "",
		role: (user?.role as Role) || "regular",
	};

	return (
		<Sheet onOpenChange={(open) => setParams({ openUserProfile: open, selectedUserId: open ? user?.id : null })} open={openUserProfile}>
			<SheetContent className="max-w-lg">
				<SheetHeader>
					<SheetTitle>Are you absolutely sure?</SheetTitle>
					<SheetDescription>This action cannot be undone. This will permanently delete your account and remove your data from our servers.</SheetDescription>
				</SheetHeader>
				<div className="m-4 overflow-auto">
					<FormRenderer
						defaultValues={defaultValues}
						formSchema={userProfileInputSchema}
						isLoading={isLoading}
						onSubmit={(data) => {
							if (!data) return;
							onSaveAction(data);
						}}
						passwordRequirements={passwordRequirements}
						submitButtonIcon={<Save />}
						submitButtonText="Save Changes"
					/>
				</div>
			</SheetContent>
		</Sheet>
	);
}
