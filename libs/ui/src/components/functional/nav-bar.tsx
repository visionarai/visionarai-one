"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import type { JSX } from "react";

import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui";
import { VisionaraiLogo } from "../visionarai-logo";
import { ThemeSwitcher } from "./ThemeSwitcher";

export type NavigationItem = {
	title: string;
	path: string;
	icon: React.ReactNode;
	iconSelected: React.ReactNode;
};

type NavBarProps = {
	items: NavigationItem[];
	appNavigationText?: string;
	appNavigationPath?: string;
	children?: JSX.Element;
	hideAppNavigation?: boolean;
};

export function NavBar({ items, appNavigationText: loginText = "Login", appNavigationPath = "/login", children, hideAppNavigation = true }: NavBarProps) {
	const pathname = usePathname();

	return (
		<nav className="sticky top-0 z-50 flex w-full items-center justify-between border-border border-b bg-background/80 px-4 py-3 backdrop-blur md:px-6">
			{/* Logo */}
			<Link aria-label="Home" className="flex items-center gap-2" href="/">
				<VisionaraiLogo followCursor={false} size={24} />
			</Link>

			{/* Desktop Navigation */}
			<div className="hidden items-center gap-4 md:flex">
				{items.map((item) => {
					const selected = pathname === item.path;
					return (
						<Link
							aria-current={selected ? "page" : undefined}
							className={`flex items-center gap-1 font-medium text-sm hover:underline ${selected ? "text-primary" : ""}`}
							href={item.path}
							key={item.path}
						>
							{selected ? item.iconSelected : item.icon}
							<span>{item.title}</span>
						</Link>
					);
				})}
			</div>

			{/* Desktop Actions */}
			<div className="hidden items-center gap-4 md:flex">
				{!hideAppNavigation && (
					<Button asChild variant="secondary">
						<Link href={appNavigationPath}>{loginText}</Link>
					</Button>
				)}
				{children}
				<ThemeSwitcher />
			</div>

			{/* Mobile Menu */}
			<div className="flex items-center gap-4 md:hidden">
				{children}
				<ThemeSwitcher />
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button aria-label="Open menu" size="icon" variant="ghost">
							<Menu className="h-5 w-5" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-56">
						{items.map((item) => {
							const selected = pathname === item.path;
							return (
								<DropdownMenuItem asChild key={item.path}>
									<Link
										aria-current={selected ? "page" : undefined}
										className={`flex items-center gap-2 font-medium text-sm hover:underline ${selected ? "text-primary" : ""}`}
										href={item.path}
									>
										{selected ? item.iconSelected : item.icon}
										<span>{item.title}</span>
									</Link>
								</DropdownMenuItem>
							);
						})}
						{!hideAppNavigation && (
							<DropdownMenuItem asChild>
								<Link href={appNavigationPath}>{loginText}</Link>
							</DropdownMenuItem>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</nav>
	);
}
