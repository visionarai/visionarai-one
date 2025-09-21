/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: We need this for dev tools */

import { Separator, Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarInset, SidebarProvider, SidebarTrigger } from "@visionarai-one/ui";
import { BrickWall, ShieldUser, Star } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { NavUser } from "./_nav-user";
import { AppSidebarNavigation } from "./_side-bar-navigation";

export default function LocaleLayout({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 transition-all ease-linear">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator className="mr-2 data-[orientation=vertical]:h-4" orientation="vertical" />
						<main className="flex-1 font-medium">VisionAI</main>
					</div>
				</header>
				<main className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
const user = {
	avatar:
		"https://media.licdn.com/dms/image/v2/D4D03AQG_k9G0Ia1xhA/profile-displayphoto-scale_400_400/B4DZkFJLWxHYAo-/0/1756727941441?e=2147483647&v=beta&t=TUqS2oh0Kq4CysIBa2NbKSPdenKJzEB69juOCBtKOfM",
	email: "er.sanyam.arya@gmail.com",
	name: "Sanyam Arya",
};
export async function AppSidebar() {
	const t = await getTranslations("Navigation");

	const adminRoutes = [
		{
			icon: <ShieldUser />,
			iconSelected: <ShieldUser strokeWidth={3} />,
			path: "/admin",
			title: t("admin"),
		},
		{
			icon: <Star />,
			iconSelected: <Star strokeWidth={3} />,
			path: "/policy",
			title: "Policy",
		},
		{
			icon: <BrickWall />,
			iconSelected: <BrickWall strokeWidth={3} />,
			path: "/master",
			title: "Master",
		},
	];
	return (
		<Sidebar collapsible="icon">
			<SidebarHeader />
			<SidebarContent>
				<AppSidebarNavigation groupTitle="Platform" navItems={adminRoutes} />
			</SidebarContent>

			<SidebarFooter>
				<NavUser user={user} />
			</SidebarFooter>
		</Sidebar>
	);
}
