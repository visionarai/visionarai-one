'use client';

import { FormRenderer, stringifyFieldMetadata } from '@visionarai-one/ui';
import { getPasswordRequirements, passwordZod } from '@visionarai-one/utils';
import { useTranslations } from 'next-intl';
import { z } from 'zod/v4';

const AllTopics = [
  { value: 'technology', label: 'Technology' },
  { value: 'health', label: 'Health' },
  { value: 'finance', label: 'Finance' },
  { value: 'education', label: 'Education' },
  { value: 'science', label: 'Science' },
  { value: 'art', label: 'Art' },
  { value: 'sports', label: 'Sports' },
  { value: 'travel', label: 'Travel' },
  { value: 'food', label: 'Food' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'environment', label: 'Environment' },
  { value: 'politics', label: 'Politics' },
  { value: 'history', label: 'History' },
];

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
    comments: z
      .string()
      .max(500, 'Comments must be less than 500 characters')
      .describe(
        stringifyFieldMetadata({
          name: 'comments',
          type: 'textarea',
          label: 'Comments',
          placeholder: 'Any additional comments?',
          description: 'Feel free to share any additional information.',
        })
      ),
    selectedTopic: z
      .string()
      .optional()
      .describe(
        stringifyFieldMetadata({
          name: 'selectedTopic',
          type: 'choice',
          label: 'Select a Topic',
          options: AllTopics,
          placeholder: 'Choose a topic',
          description: 'Select a topic that interests you.',
        })
      ),

    address: z.object({
      street: z
        .string()
        .optional()
        .describe(
          stringifyFieldMetadata({
            name: 'address.street',
            type: 'text',
            label: 'Street Address',
            placeholder: 'Enter your street address',
            description:
              'Your street address including house number and street name.',
            inputMode: 'text',
            autoComplete: 'street-address',
          })
        ),
      city: z
        .string()
        .optional()
        .describe(
          stringifyFieldMetadata({
            name: 'address.city',
            type: 'text',
            label: 'City',
            placeholder: 'Enter your city',
            description: 'The city where you live.',
          })
        ),
    }),
    selectedTopics: z
      .array(z.string())
      .min(1, 'At least one topic must be selected')
      .max(5, 'You can select up to 5 topics')
      .describe(
        stringifyFieldMetadata({
          name: 'selectedTopics',
          type: 'choice',
          label: 'Select Topics',
          options: AllTopics,
          placeholder: 'Choose topics',
          description: 'Select topics that interest you.',
          multiple: true,
        })
      ),
    subscribe: z
      .boolean()
      .optional()
      .describe(
        stringifyFieldMetadata({
          name: 'subscribe',
          type: 'switch',
          label: 'Subscribe to newsletter',
          description: 'Receive updates and news via email.',
        })
      ),
    date: z
      .date()
      .optional()
      .describe(
        stringifyFieldMetadata({
          name: 'date',
          type: 'datetime',
          label: 'Select a Date',
          placeholder: 'Pick a date',
          description: 'Choose a date for your appointment.',
          enableTimePicker: true,
        })
      ),
    dateRange: z
      .object({ from: z.date().optional(), to: z.date().optional() })
      .optional()
      .describe(
        stringifyFieldMetadata({
          name: 'dateRange',
          type: 'dateRange',
          label: 'Select a Date Range',
          placeholder: 'Pick a date range',
          description: 'Choose a date range for your booking.',
        })
      ),
  })
  .refine((data) => data.selectedTopic || data.selectedTopics.length > 0, {
    message: 'Please select at least one topic',
  });

export function LoginForm() {
  const passwordT = useTranslations('Auth.passwordRequirements');

  const passwordRequirements = getPasswordRequirements(passwordT);

  return (
    <FormRenderer
      formSchema={formSchema}
      onSubmit={(data) => {
        // biome-ignore lint/suspicious/noConsole: TODO: Remove in production
        console.log('Form submitted:', data);
      }}
      passwordRequirements={passwordRequirements}
    />
  );
}
