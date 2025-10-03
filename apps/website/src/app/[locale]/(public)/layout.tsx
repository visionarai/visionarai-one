/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: We need this for dev tools */

import { NavBar, Spinner } from "@visionarai-one/ui";
import { BookOpen, Home, Info, Star } from "lucide-react";
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
			icon: <Star className="text-muted-foreground" size={16} />,
			iconSelected: <Star className="text-primary-600" size={16} />,
			path: "/",
			title: t("features"),
		},
		{
			icon: <Home className="text-muted-foreground" size={16} />,
			iconSelected: <Home className="text-primary-600" size={16} />,
			path: "/#pricing",
			title: t("pricing"),
		},
		{
			icon: <Info className="text-muted-foreground" size={16} />,
			iconSelected: <Info className="text-primary-600" size={16} />,
			path: "/about",
			title: t("about"),
		},
		{
			icon: <BookOpen className="text-muted-foreground" size={16} />,
			iconSelected: <BookOpen className="text-primary-600" size={16} />,
			path: "/blog",
			title: t("blog"),
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
