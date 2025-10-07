"use client";

import { Button, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@visionarai-one/ui";
import { cn } from "@visionarai-one/utils";
import { Link, usePathname } from "@/i18n/navigation";

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
	return (
		<SidebarMenuItem>
			<SidebarMenuButton asChild>
				<Button
					asChild
					className={cn(
						"flex w-full items-center justify-start rounded-md px-2 py-1 font-medium text-sm transition-all",
						isActive ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-accent hover:text-accent-foreground"
					)}
					variant="ghost"
				>
					<Link aria-current={isActive ? "page" : undefined} href={navItem.path}>
						{isActive ? navItem.iconSelected : navItem.icon}
						<span>{navItem.title}</span>
					</Link>
				</Button>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
}
