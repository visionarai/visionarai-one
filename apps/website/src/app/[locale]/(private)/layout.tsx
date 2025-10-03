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
import { cookies, headers } from "next/headers";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { MainAreaTitle } from "./_navigation/main-area-title";
import { NavUser } from "./_navigation/nav-user";
import { AppSidebarNavigation } from "./_navigation/side-bar-navigation";

export default async function LocaleLayout({ children }: { children: React.ReactNode }) {
	const session = await auth.api.getSession({ headers: await headers() });

	const t = await getTranslations("Navigation");
	const tLayout = await getTranslations("PrivateLayout");
	const cookieStore = await cookies();
	const sidebarStateIsOpen = cookieStore.get("sidebar_state")?.value === "true";

	const user = {
		avatar:
			"https://media.licdn.com/dms/image/v2/D4D03AQG_k9G0Ia1xhA/profile-displayphoto-scale_400_400/B4DZkFJLWxHYAo-/0/1756727941441?e=2147483647&v=beta&t=TUqS2oh0Kq4CysIBa2NbKSPdenKJzEB69juOCBtKOfM",
		email: session?.user?.email || tLayout("userFallback.email"),
		name: session?.user?.name || tLayout("userFallback.name"),
	};

	const adminRoutes = [
		{
			icon: <Presentation />,
			iconSelected: <Presentation strokeWidth={3} />,
			path: "/policies",
			title: tLayout("routes.policies"),
		},
		{
			icon: <BrickWall />,
			iconSelected: <BrickWall strokeWidth={3} />,
			path: "/master",
			title: tLayout("routes.masterData"),
		},
	];

	const privateRoutes = [
		{
			icon: <EyeIcon />,
			iconSelected: <EyeIcon strokeWidth={3} />,
			path: "/dashboard",
			title: tLayout("routes.dashboard"),
		},
	];

	const allRoutes = [...adminRoutes, ...privateRoutes].reduce(
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
										<span className="truncate text-xs">{tLayout("enterprise")}</span>
									</div>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarHeader>
				<SidebarContent>
					<AppSidebarNavigation groupTitle={tLayout("privateArea")} navItems={privateRoutes} />
					<AppSidebarNavigation groupTitle={tLayout("adminArea")} navItems={adminRoutes} />
				</SidebarContent>

				<SidebarFooter>
					<NavUser user={user} />
				</SidebarFooter>
			</Sidebar>
			<SidebarInset>
				<MainAreaTitle allRoutes={allRoutes} />

				<section className="px-8">{children}</section>
			</SidebarInset>
		</SidebarProvider>
	);
}
