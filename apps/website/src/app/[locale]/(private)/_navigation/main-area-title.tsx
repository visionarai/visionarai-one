"use client";

import { Separator, SidebarTrigger } from "@visionarai-one/ui";
import { usePathname } from "@/i18n/navigation";

type MainAreaTitleProps = {
	allRoutes: Record<string, string>;
};

export function MainAreaTitle({ allRoutes }: MainAreaTitleProps) {
	const pathname = usePathname();
	const title = allRoutes[pathname] || "Dashboard";
	return (
		<header className="flex h-16 shrink-0 items-center gap-2 px-4 transition-all ease-linear">
			<SidebarTrigger />
			<Separator className="mr-2 data-[orientation=vertical]:h-4" orientation="vertical" />
			<span className="font-semibold text-lg">{title}</span>
		</header>
	);
}
