'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { getPasswordRequirements, passwordZod } from '@visionarai-one/utils';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Button,
  Choice,
  DatePickerInput,
  DateRangePickerInput,
  Form,
  InputFormField,
  PasswordInputFormField,
  SwitchInput,
  TextAreaFormField,
} from '@visionarai-one/ui';

const formSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: passwordZod,
    comments: z.string().max(500, 'Comments must be less than 500 characters'),
    selectedTopic: z.string().optional(),
    selectedTopics: z.array(z.string()).min(1, 'At least one topic must be selected').max(5, 'You can select up to 5 topics'),
    subscribe: z.boolean().optional(),
    date: z.date().optional(),
    dateRange: z.object({ from: z.date().optional(), to: z.date().optional() }).optional(),
  })
  .refine(data => data.selectedTopic || data.selectedTopics.length > 0, {
    message: 'Please select at least one topic',
  });

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

export function LoginForm() {
  const passwordT = useTranslations('Auth.passwordRequirements');

  const form = useForm({
    mode: 'onBlur',
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      comments: '',
      selectedTopic: 'education',
      selectedTopics: ['technology', 'health'],
      subscribe: false,
      date: new Date('2023-01-01'),
      dateRange: { from: undefined, to: undefined },
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log('Form submitted:', data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8">
        <InputFormField
          name="email"
          label="Email"
          formControl={form.control}
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          description="We will never share your email with anyone else."
        />
        <PasswordInputFormField
          name="password"
          label="Password"
          formControl={form.control}
          placeholder="Enter your password"
          description="Your password must be at least 6 characters long."
          passwordRequirements={getPasswordRequirements(passwordT)}
        />
        <TextAreaFormField
          name="comments"
          label="Comments"
          formControl={form.control}
          placeholder="Any additional comments?"
          description="Feel free to share any additional information."
        />
        <Choice
          name="selectedTopics"
          label="Select a Topic"
          formControl={form.control}
          options={AllTopics}
          placeholder="Choose a topic"
          description="Select a topic that interests you."
          multiple
        />{' '}
        <Choice
          name="selectedTopic"
          label="Select a Topic"
          formControl={form.control}
          options={AllTopics}
          placeholder="Choose a topic"
          description="Select a topic that interests you."
          emptyText="No topics available"
        />
        <SwitchInput
          name="subscribe"
          label="Subscribe to newsletter"
          formControl={form.control}
          description="Receive updates and news via email."
        />
        <DatePickerInput
          name="date"
          label="Select a Date"
          formControl={form.control}
          placeholder="Pick a date"
          description="Choose a date for your appointment."
          enableTimePicker
        />
        <DateRangePickerInput
          name="dateRange"
          label="Select a Date Range"
          formControl={form.control}
          placeholder="Pick a date range"
          description="Choose a date range for your booking."
        />
        <Button type="submit">Login</Button>
      </form>
    </Form>
  );
}
