import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
} from "@visionarai-one/ui";
import { BrickWall, EyeIcon, Presentation } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getSession } from "@/lib/auth";
import { MainAreaTitle } from "./_navigation/main-area-title";
import { NavUser } from "./_navigation/nav-user";
import { AppSidebarNavigation } from "./_navigation/side-bar-navigation";

export default async function LocaleLayout({ children }: { children: React.ReactNode }) {
	const session = getSession();

	const t = await getTranslations("Navigation");
	const cookieStore = await cookies();
	const sidebarStateIsOpen = cookieStore.get("sidebar_state")?.value === "true";

	const adminRoutes = [
		{
			icon: <Presentation />,
			iconSelected: <Presentation strokeWidth={3} />,
			path: "/policies",
			title: "Policies",
		},
		{
			icon: <BrickWall />,
			iconSelected: <BrickWall strokeWidth={3} />,
			path: "/master",
			title: "Master Data",
		},
	];

	const allRoutes = [...adminRoutes].reduce(
		(acc, route) => {
			acc[route.path] = route.title;
			return acc;
		},
		{} as Record<string, string>
	);
	return (
		<SidebarProvider defaultOpen={sidebarStateIsOpen}>
			<Sidebar collapsible="icon">
				<SidebarHeader>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton asChild size="lg">
								<Link className="flex items-center gap-2" href="/">
									<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
										<EyeIcon className="size-4" />
									</div>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-medium">{t("logo")}</span>
										<span className="truncate text-xs">Enterprise</span>
									</div>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarHeader>
				<SidebarContent>
					<pre>{JSON.stringify(session, null, 2)}</pre>
					<AppSidebarNavigation groupTitle="Admin Area" navItems={adminRoutes} />
				</SidebarContent>

				<SidebarFooter>
					<NavUser user={user} />
				</SidebarFooter>
			</Sidebar>
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 transition-all ease-linear">
					<MainAreaTitle allRoutes={allRoutes} />
				</header>
				<section className="px-8">{children}</section>
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
