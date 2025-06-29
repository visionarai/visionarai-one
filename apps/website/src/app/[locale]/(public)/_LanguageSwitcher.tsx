'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { Button } from '@visionarai-one/ui';
import { useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { memo, useTransition } from 'react';

// Allowed locales for the language switcher
export type AllowedLocales = 'en' | 'de';

const LANGS: Array<{ code: AllowedLocales; label: string }> = [
  { code: 'en', label: 'EN' },
  { code: 'de', label: 'DE' },
];

interface LanguageButtonProps {
  code: AllowedLocales;
  label: string;
  isActive: boolean;
  isPending: boolean;
  onSwitch: (locale: AllowedLocales) => void;
}

const LanguageButton = memo(function LanguageButton({ code, label, isActive, isPending, onSwitch }: LanguageButtonProps) {
  return (
    <Button
      key={code}
      size="sm"
      variant={isActive ? 'default' : 'secondary'}
      onClick={() => onSwitch(code)}
      aria-pressed={isActive}
      disabled={isPending}
      className="px-2 py-1 text-xs font-semibold">
      {label}
    </Button>
  );
});

export function LanguageSwitcher() {
  const router = useRouter();
  const currentPath = usePathname();
  const localeActive = useLocale();
  const searchParams = useSearchParams();
  const urlParams = new URLSearchParams(searchParams);
  const [isPending, startTransition] = useTransition();

  const selectedLocale = LANGS.find(({ code }) => code === localeActive) || LANGS[0];

  const handleSwitch = (locale: AllowedLocales) => {
    const searchParamString = urlParams.toString();

    startTransition(() => {
      router.push(`${currentPath}?${searchParamString}`, { locale });
    });
  };

  return (
    <div className="flex gap-1 items-center">
      {LANGS.map(({ code, label }) => (
        <LanguageButton
          key={code}
          code={code}
          label={label}
          isActive={selectedLocale.code === code}
          isPending={isPending}
          onSwitch={handleSwitch}
        />
      ))}
    </div>
  );
}
