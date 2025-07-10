// 'use client';
// import { useTranslations } from 'next-intl';
// import { FormEvent, useState } from 'react';
import { LoginForm } from './_form';

export default async function LoginPage() {
  // const t = useTranslations('Auth');
  // const [loading, setLoading] = useState(false);

  // const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   // TODO: Implement authentication logic
  //   setTimeout(() => setLoading(false), 1000);
  // };

  return <LoginForm />;
}
