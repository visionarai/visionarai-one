"use client";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	ThemeSwitcher,
	useBetterAuthFunction,
	useSidebar,
} from "@visionarai-one/ui";
import { BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut, Sparkles } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { authClient, type Session } from "@/lib/auth-client";
import { LanguageSwitcher } from "@/widgets/language-switcher";

export function NavUser({ session }: { session: Session | null }) {
	const { isMobile } = useSidebar();
	const router = useRouter();
	const user = session?.user || { email: "<Email>", name: "John Doe" };
	const avatar =
		"https://media.licdn.com/dms/image/v2/D4D03AQG_k9G0Ia1xhA/profile-displayphoto-scale_400_400/B4DZkFJLWxHYAo-/0/1756727941441?e=2147483647&v=beta&t=TUqS2oh0Kq4CysIBa2NbKSPdenKJzEB69juOCBtKOfM";

	const [signOut] = useBetterAuthFunction(authClient.signOut, {
		loadingMessage: "Signing out...",
		onSuccess: () => {
			router.push("/");
		},
		successMessage: "Logged out successfully",
	});
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground" size="lg">
							<Avatar className="h-8 w-8 rounded-lg">
								<AvatarImage alt={user.name} src={avatar} />
								<AvatarFallback className="rounded-lg">CN</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">{user.name}</span>
								<span className="truncate text-xs">{user.email}</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="end"
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage alt={user.name} src={avatar} />
									<AvatarFallback className="rounded-lg">CN</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">{user.name}</span>
									<span className="truncate text-xs">{user.email}</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem>
								<Sparkles />
								Upgrade to Pro
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem>
								<BadgeCheck />
								Account
							</DropdownMenuItem>
							<DropdownMenuItem>
								<CreditCard />
								Billing
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Bell />
								Notifications
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem asChild>
								<ThemeSwitcher type="extended" />
							</DropdownMenuItem>

							<DropdownMenuItem asChild>
								<LanguageSwitcher type="extended" />
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />

						<DropdownMenuItem onClick={() => signOut({})}>
							<LogOut />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
