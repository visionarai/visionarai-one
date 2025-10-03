/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: We need this for dev tools */

import { NavBar, Spinner } from "@visionarai-one/ui";
import { Home, Home as HomeSolid, Info, Info as InfoSolid, Star, Star as StarSolid } from "lucide-react";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { LanguageSwitcher } from "@/widgets/language-switcher";

export default async function LocaleLayout({ children }: { children: React.ReactNode }) {
	const t = await getTranslations("Navigation");
	const session = await auth.api.getSession({ headers: await headers() });
	const loginText = session?.user ? t("dashboard") : t("login");
	const appNavigationPath = session?.user ? "/dashboard" : "/login";
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
	];

	return (
		<div className="flex h-screen flex-col">
			<NavBar appNavigationPath={appNavigationPath} appNavigationText={loginText} items={navItems}>
				<Suspense fallback={<Spinner size={32} />}>
					<LanguageSwitcher />
				</Suspense>
			</NavBar>
			<main className="flex-1">{children}</main>
		</div>
	);
}
