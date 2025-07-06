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
import { DayPicker, SelectRangeEventHandler } from 'react-day-picker';
import { Control, FieldPath, FieldValues } from 'react-hook-form';

export type DateRange = {
  from: Date | undefined;
  to?: Date | undefined;
};

export type DateRangePickerInputProps<T extends FieldValues> = Omit<React.ComponentProps<typeof DayPicker>, 'mode' | 'selected' | 'onSelect'> & {
  buttonVariant?: React.ComponentProps<typeof Button>['variant'];
  name: FieldPath<T>;
  label: string;
  formControl: Control<T>;
  description?: string;
  placeholder?: string;
  disableDate?: (date: Date) => boolean;
};

export const DateRangePickerInput = <T extends FieldValues>({
  name,
  label,
  formControl,
  description,
  placeholder,
  disableDate = date => date > new Date('2025-12-12') || date < new Date('1900-01-01'),
  ...props
}: DateRangePickerInputProps<T>) => {
  const format = useFormatter();

  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field, fieldState }) => {
        const value: DateRange = field.value || { from: undefined };
        const formatted =
          value.from && value.to
            ? `${format.dateTime(value.from, { dateStyle: 'medium' })} - ${format.dateTime(value.to, { dateStyle: 'medium' })}`
            : value.from
              ? format.dateTime(value.from, { dateStyle: 'medium' })
              : '';
        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={'outline'}
                    className={cn('min-w-[240px] pl-3 text-left font-normal', !value.from && 'text-muted-foreground')}>
                    {formatted || <span>{placeholder}</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="p-2 w-full">
                <Calendar
                  mode="range"
                  numberOfMonths={2}
                  selected={value}
                  onSelect={field.onChange as SelectRangeEventHandler}
                  disabled={disableDate}
                  captionLayout="dropdown"
                  {...props}
                />
              </PopoverContent>
            </Popover>
            {description && !fieldState.error && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
