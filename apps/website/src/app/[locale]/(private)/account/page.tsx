import { TabsTrigger } from "@radix-ui/react-tabs";
import { Avatar, AvatarFallback, AvatarImage, Badge, SuspenseSwap, Tabs, TabsContent, TabsList } from "@visionarai-one/ui";
import { User } from "lucide-react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { ImpersonationIndicator } from "@/widgets/auth/impersonation-indicator";
import { PageHeader } from "@/widgets/page-header";
import { ALL_TABS, getTabDetails } from "./_state/search-params";
import AccountsTab from "./tabs/accounts";
import ProfileTab from "./tabs/profile";

export default async function AccountPage() {
	const session = await auth.api.getSession({ headers: await headers() });

	const accounts = (
		await auth.api.listUserAccounts({
			headers: await headers(),
		})
	).filter((a) => a.providerId !== "credential");

	if (!session) throw new Error("No session found");

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
							<h1 className="font-bold text-3xl">{session.user.name || "User Profile"}</h1>
							<Badge>{session.user.role}</Badge>
						</div>
						<p className="text-muted-foreground">{session.user.email}</p>
					</div>
				</div>
			</PageHeader>
			<Tabs className="mt-8 w-full" defaultValue="profile">
				<TabsList className="w-full border-b bg-background px-2">
					{ALL_TABS.map((tab) => {
						const tabDetails = getTabDetails(tab);
						return (
							<TabsTrigger className="flex w-full items-center justify-center gap-2 transition-colors data-[state=active]:bg-accent" key={tab} value={tab}>
								{tabDetails.icon} {tabDetails.title}
							</TabsTrigger>
						);
					})}
				</TabsList>

				{/* Tab content area with minimal, modern separation */}
				<div className="mt-2 rounded-xl border bg-accent/50 p-6">
					<TabsContent value="profile">
						<SuspenseSwap>
							<ProfileTab imageUrl={session.user.image} user={session.user} />
						</SuspenseSwap>
					</TabsContent>
					<TabsContent value="accounts">
						<SuspenseSwap>
							<AccountsTab accounts={accounts} />
						</SuspenseSwap>
					</TabsContent>
					<TabsContent value="security">
						<p>Security content goes here.</p>
					</TabsContent>
					<TabsContent value="sessions">
						<p>Sessions content goes here.</p>
					</TabsContent>
					<TabsContent value="danger-zone">
						<p>Danger Zone content goes here.</p>
					</TabsContent>
				</div>
			</Tabs>
		</div>
	);
}
