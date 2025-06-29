import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export async function Footer() {
  const t = await getTranslations('Footer');
  return (
    <footer className="w-full border-t border-border bg-background/80 backdrop-blur px-6 py-6 flex flex-col items-center gap-2 mt-auto">
      <Link
        href="/#contact"
        className="px-4 py-2 rounded bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        {t('contactCta', { default: 'Contact' })}
      </Link>
      <div className="text-xs text-muted-foreground mt-2 flex gap-4">
        <Link href="/#privacy">{t('links.privacy', { default: 'Privacy Policy' })}</Link>
        <Link href="/#terms">{t('links.terms', { default: 'Terms of Service' })}</Link>
      </div>
    </footer>
  );
}
