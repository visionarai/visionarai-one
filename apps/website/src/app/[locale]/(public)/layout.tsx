/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: We need this for dev tools */

import { Footer, NavBar } from "@visionarai-one/ui";
import { Home, Home as HomeSolid, Info, Info as InfoSolid, PersonStanding, Star, Star as StarSolid } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { LanguageSwitcher } from "@/widgets/language-switcher";

export default async function LocaleLayout({ children }: { children: React.ReactNode }) {
	const t = await getTranslations("Navigation");

	const navItems = [
		{
			icon: <Star size={16} />,
			iconSelected: <StarSolid size={16} />,
			path: "/#features",
			title: t("features"),
		},
		{
			icon: <Home size={16} />,
			iconSelected: <HomeSolid size={16} />,
			path: "/#pricing",
			title: t("pricing"),
		},
		{
			icon: <Info size={16} />,
			iconSelected: <InfoSolid size={16} />,
			path: "/about",
			title: t("about"),
		},
		{
			icon: <PersonStanding size={16} />,
			iconSelected: <PersonStanding size={16} />,
			path: "/policies",
			title: "Policies",
		},
	];
	const pathname = typeof window !== "undefined" ? window.location.pathname : "";
	return (
		<>
			<NavBar items={navItems} loginText={t("login")} logoText={t("logo")} selectedPath={pathname}>
				<Suspense fallback={<div>Loading...</div>}>
					<LanguageSwitcher />
				</Suspense>
			</NavBar>
			<main>{children}</main>
			<Footer />
		</>
	);
}
