'use client';

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Switch } from '@visionarai-one/ui';
import type { ComponentProps } from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';

export type SwitchInputProps<T extends FieldValues> = Omit<ComponentProps<typeof Switch>, 'name'> & {
  name: FieldPath<T>;
  label: string;
  formControl: Control<T>;
  description?: string;
};

export const SwitchInput = <T extends FieldValues>({ name, label, formControl, description, ...props }: SwitchInputProps<T>) => (
  <FormField
    control={formControl}
    name={name}
    render={({ field, fieldState }) => (
      <FormItem>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <div className="flex flex-col space-y-0.5">
            <FormLabel>{label}</FormLabel>
            {description && !fieldState.error && <FormDescription>{description}</FormDescription>}
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              {...props}
            />
          </FormControl>
        </div>
        <FormMessage />
      </FormItem>
    )}
  />
);
