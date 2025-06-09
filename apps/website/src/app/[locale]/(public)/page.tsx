import { Link } from '@/i18n/navigation';
import { Button } from '@visionarai-one/ui';
import { useTranslations } from 'next-intl';
export default function HomePage() {
  const t = useTranslations('HomePage');
  return (
    <div>
      <h1>{t('title')}</h1>

      <Button asChild>
        <Link href="/about">{t('about')}</Link>
      </Button>
    </div>
  );
}
