import { Card, CardContent, CardHeader, Tabs, TabsContent, TabsList } from "@visionarai-one/ui";
import { headers } from "next/headers";
import type { SearchParams } from "nuqs/server";
import { auth } from "@/lib/auth";
import { ALL_TABS, searchParamsCache } from "./_state/search-params";
import AccountsTab from "./tabs/accounts";
import ProfileTab from "./tabs/profile";
import { TabLink } from "./tabs/tab-link";

type AccountPageProps = {
	searchParams: Promise<SearchParams>; // Next.js 15+: async searchParams prop
};
export default async function AccountPage({ searchParams }: AccountPageProps) {
	const { selectedTab } = await searchParamsCache.parse(searchParams, { strict: true });
	const session = await auth.api.getSession({ headers: await headers() });

	const accounts = (
		await auth.api.listUserAccounts({
			headers: await headers(),
		})
	).filter((a) => a.providerId !== "credential");

	if (!session) throw new Error("No session found");

	return (
		<div>
			<Tabs value={selectedTab}>
				<Card className="mt-8">
					<CardHeader>
						<TabsList className="w-full">
							{ALL_TABS.map((tab) => (
								<TabLink className="flex-1 justify-center" key={tab} value={tab} />
							))}
						</TabsList>
					</CardHeader>
					<CardContent className="mx-6 bg-accent p-6">
						<TabsContent value="profile">
							<ProfileTab user={session.user} />
						</TabsContent>
						<TabsContent value="accounts">
							<AccountsTab accounts={accounts} />
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
					</CardContent>
				</Card>
			</Tabs>
		</div>
	);
}
