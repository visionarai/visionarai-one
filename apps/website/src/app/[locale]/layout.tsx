/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: We need this for dev tools */

import { Footer, NavBar } from "@visionarai-one/ui";
import { Home, Home as HomeSolid, Info, Info as InfoSolid, Star, Star as StarSolid } from "lucide-react";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { routing } from "@/i18n/routing";
import { LanguageSwitcher } from "./_language-switcher";
export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
	// Ensure that the incoming `locale` is valid
	const { locale } = await params;
	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	const isDev = process.env.NODE_ENV === "development";
	// Enable static rendering
	setRequestLocale(locale);

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
		<html lang={locale}>
			{isDev && (
				<head>
					<script crossOrigin="anonymous" src="//unpkg.com/react-scan/dist/auto.global.js" />
				</head>
			)}
			<body>
				{isDev && (
					<script
						dangerouslySetInnerHTML={{
							__html: `
              window.__NEXT_INTL_DEV_TOOLS = {
                enabled: true,
                locales: ${JSON.stringify(routing.locales)},
                defaultLocale: ${JSON.stringify(routing.defaultLocale)},
              };
            `,
						}}
					/>
				)}
				<NextIntlClientProvider>
					<header className="flex min-h-screen flex-col bg-background text-foreground">
						<NavBar items={navItems} loginText={t("login")} logoText={t("logo")} selectedPath={pathname}>
							<Suspense fallback={<div>Loading...</div>}>
								<LanguageSwitcher />
							</Suspense>
						</NavBar>
						<main>{children}</main>
						<Footer />
					</header>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
