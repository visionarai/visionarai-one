/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: We need this for dev tools */

import { Toaster } from "@visionarai-one/ui";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { routing } from "@/i18n/routing";
import { runtimeConfig } from "@/lib/runtime-conf";
export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

type LocaleLayoutProps = {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
	// Ensure that the incoming `locale` is valid
	const { locale } = await params;
	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	// Enable static rendering
	setRequestLocale(locale);

	return (
		<html lang={locale} suppressHydrationWarning>
			{runtimeConfig.isDev && (
				<head>
					<script crossOrigin="anonymous" src="//unpkg.com/react-scan/dist/auto.global.js" />
				</head>
			)}
			<body className="bg-background text-foreground">
				<NextIntlClientProvider>
					<ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange enableSystem>
						<NuqsAdapter>{children}</NuqsAdapter>
						<Toaster />
					</ThemeProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
