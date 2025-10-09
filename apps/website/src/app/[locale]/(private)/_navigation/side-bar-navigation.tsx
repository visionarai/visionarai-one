"use client";

import { Button, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@visionarai-one/ui";
import { cn } from "@visionarai-one/utils";
import { usePathname, useRouter } from "@/i18n/navigation";

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
	const router = useRouter();
	return (
		<SidebarMenuItem>
			<SidebarMenuButton asChild>
				<Button
					className={cn(
						"flex w-full items-center justify-start rounded-md px-2 py-1 font-medium text-sm transition-all",
						isActive ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-accent hover:text-accent-foreground"
					)}
					onClick={(e) => {
						e.preventDefault();
						router.push(navItem.path);
					}}
					variant="ghost"
				>
					{isActive ? navItem.iconSelected : navItem.icon}
					<span>{navItem.title}</span>
				</Button>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
}
