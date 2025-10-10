import { Avatar, AvatarFallback, AvatarImage, Badge, SuspenseSwap, Tabs, TabsContent, TabsList, TabsTrigger } from "@visionarai-one/ui";
import { Contact, ShieldUser, Skull, User, UserCheck, UserLock } from "lucide-react";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { auth } from "@/lib/auth";
import { ImpersonationIndicator } from "@/widgets/auth/impersonation-indicator";
import { PageHeader } from "@/widgets/page-header";
import AccountsTab from "./tabs/accounts";
import { DangerZoneTab } from "./tabs/danger-zone";
import ProfileTab from "./tabs/profile";
import { SecurityTab } from "./tabs/secuirity";
import { SessionsTab } from "./tabs/sessions";

export const ALL_TABS = ["profile", "sessions", "accounts", "security", "danger-zone"] as const;

export type AccountTab = (typeof ALL_TABS)[number];

export type TabDetails = {
	value: AccountTab;
	icon: ReactNode;
};

export default async function AccountPage() {
	const t = await getTranslations("Account");
	const tabsT = await getTranslations("Account.tabs");

	const TABS: Record<AccountTab, TabDetails> = {
		accounts: {
			icon: <UserCheck size={16} />,

			value: "accounts",
		},
		"danger-zone": {
			icon: <Skull size={16} />,

			value: "danger-zone",
		},
		profile: {
			icon: <Contact size={16} />,

			value: "profile",
		},
		security: {
			icon: <ShieldUser size={16} />,

			value: "security",
		},
		sessions: {
			icon: <UserLock size={16} />,

			value: "sessions",
		},
	};
	const getTabDetails = (tab: AccountTab) => TABS[tab];
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) throw new Error("No session found");

	const accounts = await auth.api.listUserAccounts({
		headers: await headers(),
	});

	const nonCredentialAccounts = accounts.filter((a) => a.providerId !== "credential");

	const sessions = await auth.api.listSessions({ headers: await headers() });
	const currentSessionToken = session.session.token;

	const hasPasswordAccount = accounts.some((a) => a.providerId === "credential");

	return (
		<div>
			<PageHeader subtitle="Manage your account settings and set e-mail preferences." title="Account">
				<ImpersonationIndicator />

				<div className="flex items-center space-x-4">
					<Avatar className="size-16 rounded-lg">
						<AvatarImage alt={session.user.name || "User Avatar"} src={session.user.image || undefined} />
						<AvatarFallback>
							<User size={40} />
						</AvatarFallback>
					</Avatar>

					<div className="flex-1">
						<div className="flex items-start justify-between gap-1">
							<h1 className="font-bold text-3xl">{session.user.name || t("userProfileFallback")}</h1>
							<Badge>{session.user.role}</Badge>
						</div>
						<p className="text-muted-foreground">{session.user.email}</p>
					</div>
				</div>
			</PageHeader>
			<Tabs className="mt-8 w-full" defaultValue="profile">
				<TabsList className="w-full border-b px-2">
					{ALL_TABS.map((tab) => {
						const tabDetails = getTabDetails(tab);
						return (
							<TabsTrigger key={tab} value={tab}>
								{tabDetails.icon} {tabsT(`${tabDetails.value}.label`)}
							</TabsTrigger>
						);
					})}
				</TabsList>

				{/* Tab content area with minimal, modern separation */}
				<div className="mt-6">
					<TabContentArea value="profile">
						<ProfileTab />
					</TabContentArea>

					<TabContentArea value="accounts">
						<AccountsTab accounts={nonCredentialAccounts} />
					</TabContentArea>

					<TabContentArea value="sessions">
						<SessionsTab currentSessionToken={currentSessionToken} sessions={sessions} />
					</TabContentArea>

					<TabContentArea value="security">
						<SecurityTab hasPasswordAccount={hasPasswordAccount} />
					</TabContentArea>

					<TabContentArea value="danger-zone">
						<DangerZoneTab />
					</TabContentArea>
				</div>
			</Tabs>
		</div>
	);
}

export async function TabContentArea({ children, value }: { children: ReactNode; value: AccountTab }) {
	const tabsT = await getTranslations("Account.tabs");
	const title = tabsT(`${value}.label`) || tabsT(`${value}`);
	const description = tabsT(`${value}.description`) || "";
	return (
		<TabsContent value={value}>
			<div className="space-y-6">
				<div className="space-y-1">
					<h2 className="font-bold text-2xl">{title}</h2>
					<p className="text-muted-foreground">{description}</p>
				</div>
				<SuspenseSwap>{children}</SuspenseSwap>
			</div>
		</TabsContent>
	);
}
