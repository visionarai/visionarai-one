import { Footer, NavBar } from '@visionarai-one/ui';
import { Home, Home as HomeSolid, Info, Info as InfoSolid, Star, Star as StarSolid } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations('Navigation');

  const navItems = [
    { title: t('features'), path: '#features', icon: <Star size={16} />, iconSelected: <StarSolid size={16} /> },
    { title: t('pricing'), path: '#pricing', icon: <Home size={16} />, iconSelected: <HomeSolid size={16} /> },
    { title: t('about'), path: '/about', icon: <Info size={16} />, iconSelected: <InfoSolid size={16} /> },
  ];
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <NavBar
        items={navItems}
        selectedPath={pathname}
        loginText={t('login')}
        logoText={t('logo')}
      />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
