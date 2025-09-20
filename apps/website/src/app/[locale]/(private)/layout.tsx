/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: We need this for dev tools */

import {
	Separator,
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
	ThemeSwitcher,
} from "@visionarai-one/ui";
import { Star, Star as StarSolid } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { LanguageSwitcher } from "@/widgets/language-switcher";

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

export async function AppSidebar() {
	const t = await getTranslations("Navigation");
	const pathname = typeof window !== "undefined" ? window.location.pathname : "";
	const navItems = [
		{
			icon: <Star size={16} />,
			iconSelected: <StarSolid size={16} />,
			path: "/admin",
			title: t("admin"),
		},
		{
			icon: <Star size={16} />,
			iconSelected: <StarSolid size={16} />,
			path: "/policy",
			title: "Policy",
		},
		{
			icon: <Star size={16} />,
			iconSelected: <StarSolid size={16} />,
			path: "/master",
			title: "Master",
		},
	];
	return (
		<Sidebar collapsible="icon">
			<SidebarHeader />
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Platform</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{navItems.map((item) => {
								const selected = pathname === item.path;
								return (
									<SidebarMenuItem key={item.path}>
										<SidebarMenuButton asChild>
											<Link
												aria-current={selected ? "page" : undefined}
												className={`flex items-center gap-1 font-medium text-sm hover:underline ${selected ? "text-primary" : ""}`}
												href={item.path}
												key={item.path}
											>
												{selected ? item.iconSelected : item.icon}
												<span>{item.title}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<div className="p-4 text-muted-foreground text-xs">© 2024 VisionAI</div>

				<Suspense fallback={<div>Loading...</div>}>
					<LanguageSwitcher />
				</Suspense>
				<ThemeSwitcher />
			</SidebarFooter>
		</Sidebar>
	);
}
