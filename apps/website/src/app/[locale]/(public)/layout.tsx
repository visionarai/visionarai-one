import { Footer, NavBar } from '@visionarai-one/ui';
import { Home, Home as HomeSolid, Info, Info as InfoSolid, Star, Star as StarSolid } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { LanguageSwitcher } from './_language-switcher';
export default async function PublicLayout({
	children,
	// params,
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const t = await getTranslations('Navigation');

	const navItems = [
		{
			icon: <Star size={16} />,
			iconSelected: <StarSolid size={16} />,
			path: '/#features',
			title: t('features'),
		},
		{
			icon: <Home size={16} />,
			iconSelected: <HomeSolid size={16} />,
			path: '/#pricing',
			title: t('pricing'),
		},
		{
			icon: <Info size={16} />,
			iconSelected: <InfoSolid size={16} />,
			path: '/about',
			title: t('about'),
		},
	];
	const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
	return (
		<header className="flex min-h-screen flex-col bg-background text-foreground">
			<NavBar items={navItems} loginText={t('login')} logoText={t('logo')} selectedPath={pathname}>
				<LanguageSwitcher />
			</NavBar>
			<main>{children}</main>
			<Footer />
		</header>
	);
}
