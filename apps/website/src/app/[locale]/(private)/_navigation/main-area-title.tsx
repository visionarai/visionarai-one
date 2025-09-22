"use client";
import { Button, Separator, useSidebar } from "@visionarai-one/ui";
import { PanelLeftIcon } from "lucide-react";
import { useQueryStates } from "nuqs";
import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";
import { searchParamParsers } from "./search-params";

type MainAreaTitleProps = {
	allRoutes: Record<string, string>;
};

export function MainAreaTitle({ allRoutes }: MainAreaTitleProps) {
	const [{ sidebarOpen }, setSearchParams] = useQueryStates(searchParamParsers);
	const { setOpen } = useSidebar();

	useEffect(() => {
		if (sidebarOpen !== undefined) {
			setOpen(sidebarOpen);
		}
	}, [sidebarOpen, setOpen]);

	const handleToggleSidebar = () => {
		setSearchParams({ sidebarOpen: !sidebarOpen });
		setOpen(!sidebarOpen);
	};

	const pathname = usePathname();
	const title = allRoutes[pathname] || "Dashboard";
	return (
		<div className="flex items-center gap-2 px-4">
			<Button onClick={handleToggleSidebar} size="icon" variant="ghost">
				<PanelLeftIcon />
			</Button>
			<Separator className="mr-2 data-[orientation=vertical]:h-4" orientation="vertical" />
			<span className="font-semibold text-lg">{title}</span>
		</div>
	);
}
