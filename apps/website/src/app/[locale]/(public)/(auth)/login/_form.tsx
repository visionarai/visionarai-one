'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button, Form, InputFormField } from '@visionarai-one/ui';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export function LoginForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log('Form submitted:', data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6">
        <InputFormField
          name="email"
          label="Email"
          formControl={form.control}
          type="email"
          placeholder="Enter your email"
          description="We will never share your email with anyone else."
        />

        <InputFormField
          name="password"
          label="Password"
          formControl={form.control}
          type="password"
          placeholder="Enter your password"
          description="Your password must be at least 6 characters long."
        />
        <Button type="submit">Login</Button>
      </form>
    </Form>
  );
}
