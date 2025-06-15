import { Link } from '@/i18n/navigation';
import { Button } from '@visionarai-one/ui';
import { useFormatter, useNow, useTranslations } from 'next-intl';
export default function HomePage() {
  const t = useTranslations('HomePage');
  const format = useFormatter();
  const now = useNow();

  const date = new Date('2023-10-01T12:00:00Z'); // Example date

  format.relativeTime(date, now);
  const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' },
  ];

  const items = users.map(user => (
    <a
      key={user.id}
      href={`/user/${user.id}`}>
      {user.name}
    </a>
  ));
  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-screen gap-4">
      <h1>{t('title')}</h1>
      <p>{format.list(items)}</p>
      <p>{format.relativeTime(date, now)}</p>
      <p>{format.number(30.9, { style: 'currency', currency: 'INR' })}</p>
      <p>{t('percentage', { value: 0.58 })}</p>
      <Button asChild>
        <Link href="/about">{t('about')}</Link>
      </Button>
    </div>
  );
}
