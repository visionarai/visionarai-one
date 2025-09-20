/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: We need this for dev tools */

import { Footer, NavBar } from "@visionarai-one/ui";
import { Star, Star as StarSolid } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { LanguageSwitcher } from "@/widgets/language-switcher";

export default async function LocaleLayout({ children }: { children: React.ReactNode }) {
	const t = await getTranslations("Navigation");

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
