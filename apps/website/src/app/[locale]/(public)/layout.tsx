import { Footer, NavBar } from '@visionarai-one/ui';
import { Home, Home as HomeSolid, Info, Info as InfoSolid, Star, Star as StarSolid } from 'lucide-react';

const navItems = [
  { title: 'Features', path: '#features', icon: <Star size={16} />, iconSelected: <StarSolid size={16} /> },
  { title: 'Pricing', path: '#pricing', icon: <Home size={16} />, iconSelected: <HomeSolid size={16} /> },
  { title: 'About', path: '/about', icon: <Info size={16} />, iconSelected: <InfoSolid size={16} /> },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <NavBar
        items={navItems}
        selectedPath={pathname}
      />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">{children}</main>
      <Footer />
    </div>
  );
}
