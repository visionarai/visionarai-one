'use client';
import { Button, Input } from '@visionarai-one/ui';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { FormEvent, useState } from 'react';

export default function RegisterPage() {
  const t = useTranslations('Auth');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Implement registration logic
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium mb-1">
          {t('register.emailLabel')}
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder={t('register.emailPlaceholder')}
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium mb-1">
          {t('register.passwordLabel')}
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          placeholder={t('register.passwordPlaceholder')}
        />
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={loading}>
        {t('register.submit')}
      </Button>
      <div className="text-center text-sm mt-4">
        {t('register.haveAccount')}{' '}
        <Link
          href="/login"
          className="text-primary underline">
          {t('register.loginLink')}
        </Link>
      </div>
    </form>
  );
}
