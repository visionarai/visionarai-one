/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: We need this for dev tools */

import { Toaster } from "@visionarai-one/ui";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
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
				{/* className="flex min-h-screen flex-col bg-background text-foreground" */}
				<NextIntlClientProvider>
					{children}
					<Toaster />
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
