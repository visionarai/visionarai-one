/** biome-ignore-all lint/suspicious/noExplicitAny: TODO: remove */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Form,
  type PasswordRequirementProps,
} from '@visionarai-one/ui';
import type { DefaultValues } from 'react-hook-form';
import { type Control, useForm } from 'react-hook-form';
import type { z } from 'zod/v4';
import { FieldRenderer } from './field-renderer';
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

  const extractedFields = extractFieldConfigsFromSchema(formSchema).filter(
    (field) => field.name
  );

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        {extractedFields.map((fieldMetadata) => {
          return (
            <FieldRenderer
              fieldMetadata={
                fieldMetadata.type === 'password'
                  ? { ...fieldMetadata, passwordRequirements }
                  : fieldMetadata
              }
              formControl={form.control as Control<FormValues>}
              key={fieldMetadata.name}
            />
          );
        })}
        <div className="flex w-full gap-4">
          <Button
            className="flex items-center justify-center gap-2"
            type="submit"
            variant="default"
          >
            {submitButtonIcon}
            {submitButtonText}
          </Button>
          <Button
            className="flex items-center justify-center gap-2"
            onClick={() => form.reset()}
            type="button"
            variant="secondary"
          >
            {resetButtonIcon}
            {resetButtonText}
          </Button>
        </div>
      </form>
    </Form>
  );
}
