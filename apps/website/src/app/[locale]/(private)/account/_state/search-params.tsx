import { Contact, ShieldUser, Skull, UserCheck, UserLock } from "lucide-react";
import { createSearchParamsCache, createSerializer, parseAsStringEnum } from "nuqs/server";
import type { ReactNode } from "react";

export const ALL_TABS = ["profile", "accounts", "security", "sessions", "danger-zone"] as const;

export type AccountTab = (typeof ALL_TABS)[number];

export type TabDetails = {
	value: AccountTab;
	title: string;
	description: string;
	icon: ReactNode;
};

const TABS: Record<AccountTab, TabDetails> = {
	accounts: {
		description: "Manage your connected accounts and social logins.",
		icon: <UserCheck />,
		title: "Accounts",
		value: "accounts",
	},
	"danger-zone": {
		description: "Delete your account or perform other irreversible actions.",
		icon: <Skull />,
		title: "Danger Zone",
		value: "danger-zone",
	},
	profile: {
		description: "Update your personal information and contact details.",
		icon: <Contact />,
		title: "Profile",
		value: "profile",
	},
	security: {
		description: "Change your password and enable two-factor authentication.",
		icon: <ShieldUser />,
		title: "Security",
		value: "security",
	},
	sessions: {
		description: "View and manage your active sessions and devices.",
		icon: <UserLock />,
		title: "Sessions",
		value: "sessions",
	},
};

export const getTabDetails = (tab: AccountTab) => TABS[tab];

export const querySearchParams = {
	selectedTab: parseAsStringEnum([...ALL_TABS] as const)
		.withDefault("accounts")
		.withOptions({ clearOnDefault: true, shallow: false }),
};

export const searchParamsCache = createSearchParamsCache(querySearchParams);

export const serialize = createSerializer(querySearchParams);

// export const serializeUrl = (selectedTab: AccountTab) =>
// 	`/account${serialize({
// 		selectedTab,
// 	})}`;

const queryRegex = /^\?/;

export const serializeUrl = (selectedTab: AccountTab) => ({
	pathname: "/account",
	query: serialize({ selectedTab }).replace(queryRegex, ""),
});
