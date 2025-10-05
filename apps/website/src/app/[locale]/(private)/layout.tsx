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
	TheyEyeOfVision,
} from "@visionarai-one/ui";
import { BrickWall, Database, EyeIcon, Presentation } from "lucide-react";
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
		{
			icon: <Database />,
			iconSelected: <Database strokeWidth={3} />,
			path: "/user-management",
			title: tLayout("routes.userManagement"),
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
									<TheyEyeOfVision className="!border-2" followCursor={false} size={24} />
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
					{session?.user.role === "admin" && <AppSidebarNavigation groupTitle={tLayout("adminArea")} navItems={adminRoutes} />}
				</SidebarContent>

				<SidebarFooter>
					<NavUser session={session} />
				</SidebarFooter>
			</Sidebar>
			<SidebarInset>
				<MainAreaTitle allRoutes={allRoutes} />

				<section className="px-8">{children}</section>
			</SidebarInset>
		</SidebarProvider>
	);
}
