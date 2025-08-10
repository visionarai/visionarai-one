'use client';

import { FormRenderer, stringifyFieldMetadata } from '@visionarai-one/ui';
import { getPasswordRequirements, passwordZod } from '@visionarai-one/utils';
import { RotateCcw, SendHorizontal } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { z } from 'zod/v4';

// const AllTopics = [
//   { value: 'technology', label: 'Technology' },
//   { value: 'health', label: 'Health' },
//   { value: 'finance', label: 'Finance' },
//   { value: 'education', label: 'Education' },
//   { value: 'science', label: 'Science' },
//   { value: 'art', label: 'Art' },
//   { value: 'sports', label: 'Sports' },
//   { value: 'travel', label: 'Travel' },
//   { value: 'food', label: 'Food' },
//   { value: 'lifestyle', label: 'Lifestyle' },
//   { value: 'entertainment', label: 'Entertainment' },
//   { value: 'environment', label: 'Environment' },
//   { value: 'politics', label: 'Politics' },
//   { value: 'history', label: 'History' },
// ];

const formSchema = z
  .object({
    email: z.email('Invalid email address').describe(
      stringifyFieldMetadata({
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'Enter your email',
        description: 'We will never share your email with anyone else.',
        inputMode: 'email',
        autoComplete: 'email',
      })
    ),
    password: passwordZod.describe(
      stringifyFieldMetadata({
        name: 'password',
        type: 'password',
        label: 'Password',
        placeholder: 'Enter your password',
        description: 'Your password must be at least 6 characters long.',
      })
    ),
    confirmPassword: z.string().describe(
      stringifyFieldMetadata({
        name: 'confirmPassword',
        type: 'password-no',
        label: 'Confirm Password',
        placeholder: 'Re-enter your password',
        description: 'Please confirm your password.',
      })
    ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export function LoginForm() {
  const passwordT = useTranslations('Auth.passwordRequirements');

  const passwordRequirements = getPasswordRequirements(passwordT);

  return (
    <FormRenderer
      formSchema={formSchema}
      onSubmit={(data) => {
        // biome-ignore lint/suspicious/noConsole: Debugging purpose
        console.log('Form submitted:', data);
      }}
      passwordRequirements={passwordRequirements}
      resetButtonIcon={<RotateCcw />}
      submitButtonIcon={<SendHorizontal />}
    />
  );
}
