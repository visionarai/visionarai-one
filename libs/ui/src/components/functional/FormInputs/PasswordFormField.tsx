'use client';

import { Button, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Input } from '@visionarai-one/ui';
import { cn } from '@visionarai-one/utils';
import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
export type PasswordFormFieldProps<T extends FieldValues> = React.ComponentProps<'input'> & {
  name: FieldPath<T>;
  label: string;
  formControl: Control<T>;
  passwordRequirements?: PasswordRequirementProps[];
  placeholder?: string;
  description?: string;
};
export type PasswordRequirementProps = {
  key: string;
  test: (value: string) => boolean;
  message: string;
};

export function PasswordFormField<T extends FieldValues>({
  name,
  label,
  formControl,
  placeholder,
  description,
  passwordRequirements,
  ...props
}: PasswordFormFieldProps<T>) {
  const [type, setType] = useState<'password' | 'text'>('password');

  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field }) => {
        const metRequirements = passwordRequirements?.map(req => req.test(field.value)) || [];
        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  type={type}
                  autoComplete="current-password"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  placeholder={placeholder}
                  {...field}
                  {...props}
                />
                <Button
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-0"
                  variant="link"
                  size="icon"
                  onClick={() => setType(type === 'password' ? 'text' : 'password')}
                  aria-label={type === 'password' ? 'Show password' : 'Hide password'}>
                  {type === 'password' ? <EyeOffIcon /> : <EyeIcon />}
                </Button>
              </div>
            </FormControl>

            {passwordRequirements?.map((req, idx) => (
              <FormDescription
                key={req.key}
                className="text-sm">
                <span className={cn('inline-block mr-2', metRequirements[idx] ? 'text-green-600' : 'text-destructive')}>
                  {metRequirements[idx] ? <CheckIcon className="inline" /> : <XIcon className="inline" />} {req.message}
                </span>
              </FormDescription>
            ))}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
