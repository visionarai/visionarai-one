'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form, PasswordRequirementProps } from '@visionarai-one/ui';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { FieldRenderer } from './FieldRenderer';
import { extractFieldConfigsFromSchema } from './types';
type FormRendererProps = {
  formSchema: z.ZodObject;
  passwordRequirements?: PasswordRequirementProps[];
};

export function FormRenderer({ formSchema, passwordRequirements }: FormRendererProps) {
  type FormValues = z.infer<typeof formSchema>;
  const form = useForm<FormValues>({
    mode: 'onBlur',
    resolver: zodResolver(formSchema),
    // You may want to accept defaultValues as a prop or infer from schema
    // For now, leave as empty object to avoid type errors
    defaultValues: {} as FormValues,
  });

  const extractedFields = extractFieldConfigsFromSchema(formSchema).filter(field => field.name);
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log('Form submitted:', data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8">
        {extractedFields.map(fieldMetadata => {
          return (
            <FieldRenderer
              key={fieldMetadata.name}
              fieldMetadata={fieldMetadata.type === 'password' ? { ...fieldMetadata, passwordRequirements } : fieldMetadata}
              formControl={form.control}
            />
          );
        })}
      </form>
    </Form>
  );
}
