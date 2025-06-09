'use client';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'de', label: 'DE' },
];

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const handleSwitch = (lang: string) => {
    if (lang === locale) return;
    // Replace the locale in the pathname
    const segments = pathname.split('/');
    segments[1] = lang;
    const newPath = segments.join('/');
    startTransition(() => {
      router.replace(newPath);
    });
  };

  return (
    <div className="flex gap-1 items-center">
      {LANGS.map(({ code, label }) => (
        <button
          key={code}
          className={`px-2 py-1 rounded text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
            locale === code ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
          }`}
          onClick={() => handleSwitch(code)}
          aria-pressed={locale === code}
          disabled={isPending}>
          {label}
        </button>
      ))}
    </div>
  );
}
