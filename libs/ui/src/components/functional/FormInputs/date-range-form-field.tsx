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
import type { DayPicker, SelectRangeEventHandler } from 'react-day-picker';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

export type DateRange = {
  from: Date | undefined;
  to?: Date | undefined;
};

export type DateRangeFormFieldProps<T extends FieldValues> = Omit<
  React.ComponentProps<typeof DayPicker>,
  'mode' | 'selected' | 'onSelect'
> & {
  buttonVariant?: React.ComponentProps<typeof Button>['variant'];
  name: FieldPath<T>;
  label: string;
  formControl: Control<T>;
  description?: string;
  placeholder?: string;
  disableDate?: (date: Date) => boolean;
};

export const DateRangeFormField = <T extends FieldValues>({
  name,
  label,
  formControl,
  description,
  placeholder,
  disableDate = (date) =>
    date > new Date('2025-12-12') || date < new Date('1900-01-01'),
  ...props
}: DateRangeFormFieldProps<T>) => {
  const format = useFormatter();

  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field, fieldState }) => {
        const value: DateRange = field.value || { from: undefined };
        let formatted = '';
        if (value.from && value.to) {
          formatted = `${format.dateTime(value.from, { dateStyle: 'medium' })} - ${format.dateTime(value.to, { dateStyle: 'medium' })}`;
        } else if (value.from) {
          formatted = format.dateTime(value.from, { dateStyle: 'medium' });
        }
        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    className={cn(
                      'min-w-[240px] pl-3 text-left font-normal',
                      !value.from && 'text-muted-foreground'
                    )}
                    variant={'outline'}
                  >
                    {formatted || <span>{placeholder}</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-full p-2">
                <Calendar
                  captionLayout="dropdown"
                  disabled={disableDate}
                  mode="range"
                  numberOfMonths={2}
                  onSelect={field.onChange as SelectRangeEventHandler}
                  selected={value}
                  {...props}
                />
              </PopoverContent>
            </Popover>
            {description && !fieldState.error && (
              <FormDescription>{description}</FormDescription>
            )}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
