"use client";

import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@visionarai-one/ui";
import { cn } from "@visionarai-one/utils";
import { useQueryStates } from "nuqs";
import { Link, usePathname } from "@/i18n/navigation";
import { searchParamParsers } from "./search-params";

type NavItem = {
	icon: React.ReactNode;
	iconSelected: React.ReactNode;
	path: string;
	title: string;
};

type AppSidebarProps = {
	navItems: NavItem[];
	groupTitle: string;
};

export function AppSidebarNavigation({ navItems, groupTitle }: AppSidebarProps) {
	const pathname = usePathname();

	return (
		<SidebarGroup>
			<SidebarGroupLabel>{groupTitle}</SidebarGroupLabel>
			<SidebarGroupContent>
				<SidebarMenu>
					{navItems.map((item) => {
						const selected = pathname === item.path;
						return <SideBarLink isActive={selected} key={item.path} navItem={item} />;
					})}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}

function SideBarLink({ navItem, isActive }: { navItem: NavItem; isActive: boolean }) {
	const [{ sidebarOpen }] = useQueryStates(searchParamParsers);
	return (
		<SidebarMenuItem>
			<SidebarMenuButton asChild>
				<Link
					aria-current={isActive ? "page" : undefined}
					className={cn(
						"flex w-full items-center rounded-md px-2 py-1 font-medium text-sm transition-all",
						isActive ? "bg-primary text-primary-foreground" : "text-foreground"
					)}
					href={`${navItem.path}?sidebarOpen=${sidebarOpen}`}
				>
					{isActive ? navItem.iconSelected : navItem.icon}
					<span>{navItem.title}</span>
				</Link>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
}
