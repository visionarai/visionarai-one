'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button, Choice, Form, InputFormField, TextAreaFormField } from '@visionarai-one/ui';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  comments: z.string().max(500, 'Comments must be less than 500 characters'),
  selectedTopic: z.string().optional(),
  selectedTopics: z.array(z.string()).min(1, 'At least one topic must be selected').max(5, 'You can select up to 5 topics'),
});

const AllTopics = [
  { value: 'technology', label: 'Technology' },
  { value: 'health', label: 'Health' },
  { value: 'finance', label: 'Finance' },
  { value: 'education', label: 'Education' },
  { value: 'science', label: 'Science' },
];

export function LoginForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      comments: '',
      selectedTopic: 'education',
      selectedTopics: ['technology', 'health'],
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
        <InputFormField
          name="password"
          label="Password"
          formControl={form.control}
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          description="Your password must be at least 6 characters long."
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
        />
        <Button type="submit">Login</Button>
      </form>
    </Form>
  );
}
