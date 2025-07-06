'use client';

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Input } from '@visionarai-one/ui';
import { Control, FieldPath, FieldValues } from 'react-hook-form';

export type InputFieldProps<T extends FieldValues> = React.ComponentProps<'input'> & {
  name: FieldPath<T>;
  label: string;
  formControl: Control<T>;
  placeholder?: string;
  description?: string;
};

export function InputFormField<T extends FieldValues>({ name, label, formControl, type = 'text', placeholder, description, ...props }: InputFieldProps<T>) {
  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              {...field}
              {...props}
            />
          </FormControl>
          {description && !fieldState.error && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
