import { Footer, NavBar } from '@visionarai-one/ui';
import {
  Home,
  Home as HomeSolid,
  Info,
  Info as InfoSolid,
  Star,
  Star as StarSolid,
} from 'lucide-react';
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
      title: t('features'),
      path: '/#features',
      icon: <Star size={16} />,
      iconSelected: <StarSolid size={16} />,
    },
    {
      title: t('pricing'),
      path: '/#pricing',
      icon: <Home size={16} />,
      iconSelected: <HomeSolid size={16} />,
    },
    {
      title: t('about'),
      path: '/about',
      icon: <Info size={16} />,
      iconSelected: <InfoSolid size={16} />,
    },
  ];
  const pathname =
    typeof window !== 'undefined' ? window.location.pathname : '';
  return (
    <header className="flex min-h-screen flex-col bg-background text-foreground">
      <NavBar
        items={navItems}
        loginText={t('login')}
        logoText={t('logo')}
        selectedPath={pathname}
      >
        <LanguageSwitcher />
      </NavBar>
      <main>{children}</main>
      <Footer />
    </header>
  );
}
