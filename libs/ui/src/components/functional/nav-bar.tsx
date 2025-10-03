"use client";

import Link from "next/link";
import type React from "react";
import type { JSX } from "react";
import { Button } from "../ui/button";
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
	logoText?: string;
	children?: JSX.Element;
};

export function NavBar({ items, appNavigationText: loginText = "Login", appNavigationPath = "/login", logoText = "Visionar.Ai", children }: NavBarProps) {
	return (
		<nav className="sticky top-0 z-50 flex w-full items-center justify-between border-border border-b bg-background/80 px-6 py-3 backdrop-blur">
			{/* Logo */}
			<Link className="flex items-center gap-2" href="/">
				{/* Replace with your SVG or image logo */}
				<span className="font-bold text-lg tracking-tight">{logoText}</span>
			</Link>
			{/* Navigation Links & Switchers */}
			<div className="flex items-center gap-4">
				{items.map((item) => {
					const selected = typeof window !== "undefined" && window.location.pathname === item.path;
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
				<Button asChild variant="secondary">
					<Link href={appNavigationPath}>{loginText}</Link>
				</Button>
				{children}
				<ThemeSwitcher />
			</div>
		</nav>
	);
}
