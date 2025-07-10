'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, PasswordRequirementProps } from '@visionarai-one/ui';
import type { DefaultValues } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { FieldRenderer } from './FieldRenderer';
import { extractFieldConfigsFromSchema } from './types';
type FormRendererProps<T extends z.ZodObject<any, any>> = {
  formSchema: T;
  onSubmit: (data: z.infer<T>) => void;
  defaultValues?: DefaultValues<z.infer<T>>;
  passwordRequirements?: PasswordRequirementProps[];
  submitButtonText?: string;
  submitButtonIcon?: React.ReactNode;
  resetButtonText?: string;
  resetButtonIcon?: React.ReactNode;
};

export function FormRenderer<T extends z.ZodObject<any, any>>({
  formSchema,
  passwordRequirements,
  onSubmit,
  defaultValues,
  submitButtonText = 'Submit',
  submitButtonIcon,
  resetButtonText = 'Reset',
  resetButtonIcon,
}: FormRendererProps<T>) {
  type FormValues = z.infer<T>;
  const form = useForm<FormValues>({
    mode: 'onBlur',
    resolver: zodResolver(formSchema) as any, // react-hook-form/zodResolver type mismatch workaround
    defaultValues: defaultValues as DefaultValues<FormValues>,
    resetOptions: {
      keepDirtyValues: false,
      keepDefaultValues: true,
    },
  });

  const extractedFields = extractFieldConfigsFromSchema(formSchema).filter(field => field.name);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit as any)}
        className="space-y-8">
        {extractedFields.map(fieldMetadata => {
          return (
            <FieldRenderer
              key={fieldMetadata.name}
              fieldMetadata={fieldMetadata.type === 'password' ? { ...fieldMetadata, passwordRequirements } : fieldMetadata}
              formControl={form.control as any}
            />
          );
        })}
        <div className="flex gap-4 w-full">
          <Button
            type="submit"
            variant="default"
            className="flex items-center justify-center gap-2">
            {submitButtonIcon}
            {submitButtonText}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="flex items-center justify-center gap-2"
            onClick={() => form.reset()}>
            {resetButtonIcon}
            {resetButtonText}
          </Button>
        </div>
      </form>
    </Form>
  );
}
