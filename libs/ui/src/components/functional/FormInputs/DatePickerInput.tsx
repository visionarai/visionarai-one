'use client';

import {
  Button,
  Calendar,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@visionarai-one/ui';
import { cn } from '@visionarai-one/utils';
import { CalendarIcon } from 'lucide-react';
import { useFormatter } from 'next-intl';
import { DayPicker } from 'react-day-picker';
import { Control, FieldPath, FieldValues } from 'react-hook-form';

export type DatePickerInputProps<T extends FieldValues> = Omit<React.ComponentProps<typeof DayPicker>, 'mode' | 'selected' | 'onSelect'> & {
  buttonVariant?: React.ComponentProps<typeof Button>['variant'];
} & {
  name: FieldPath<T>;
  label: string;
  formControl: Control<T>;
  description?: string;
  placeholder?: string;
  disableDate?: (date: Date) => boolean;
};

export const DatePickerInput = <T extends FieldValues>({
  name,
  label,
  formControl,
  description,
  placeholder,
  disableDate = date => date > new Date('2025-12-12') || date < new Date('1900-01-01'),
  ...props
}: DatePickerInputProps<T>) => {
  const format = useFormatter();
  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>

          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={'outline'}
                  className={cn('min-w-[240px] pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                  {field.value ? format.dateTime(field.value, { dateStyle: 'medium' }) : <span>{placeholder}</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="p-2 w-full">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={disableDate}
                captionLayout="dropdown"
                {...props}
              />
            </PopoverContent>
          </Popover>

          {description && !fieldState.error && <FormDescription>{description}</FormDescription>}

          <FormMessage />
        </FormItem>
      )}
    />
  );
};
