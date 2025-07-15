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
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@visionarai-one/ui';
import { cn } from '@visionarai-one/utils';
import { CalendarIcon, ClockIcon } from 'lucide-react';
import { useFormatter } from 'next-intl';
import { useCallback } from 'react';
import type { DayPicker } from 'react-day-picker';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

export type DateTimeFormFieldProps<T extends FieldValues> = Omit<
  React.ComponentProps<typeof DayPicker>,
  'mode' | 'selected' | 'onSelect'
> & {
  buttonVariant?: React.ComponentProps<typeof Button>['variant'];
} & {
  name: FieldPath<T>;
  label: string;
  formControl: Control<T>;
  description?: string;
  placeholder?: string;
  disableDate?: (date: Date) => boolean;
  /** Enable time picker functionality */
  enableTimePicker?: boolean;
  /** Show seconds in time picker (only when enableTimePicker is true) */
  showSeconds?: boolean;
  /** Default time when date is selected and time picker is disabled */
  defaultTime?: { hours: number; minutes: number; seconds: number };
};

export const DateTimeFormField = <T extends FieldValues>({
  name,
  label,
  formControl,
  description,
  placeholder,
  disableDate = (date) =>
    date > new Date('2025-12-12') || date < new Date('1900-01-01'),
  enableTimePicker = false,
  showSeconds = false,
  defaultTime = { hours: 0, minutes: 0, seconds: 0 },
  ...props
}: DateTimeFormFieldProps<T>) => {
  const format = useFormatter();

  // Helper function to create a new date with specified time
  const createDateWithTime = useCallback(
    (date: Date, time: { hours: number; minutes: number; seconds: number }) => {
      const newDate = new Date(date);
      newDate.setHours(time.hours, time.minutes, time.seconds, 0);
      return newDate;
    },
    []
  );

  // Extract time from a date object
  const extractTimeFromDate = useCallback(
    (date: Date) => ({
      hours: date.getHours(),
      minutes: date.getMinutes(),
      seconds: date.getSeconds(),
    }),
    []
  );

  // Format time for display in input
  const formatTimeForInput = useCallback(
    (time: { hours: number; minutes: number; seconds: number }) => {
      const hours = time.hours.toString().padStart(2, '0');
      const minutes = time.minutes.toString().padStart(2, '0');
      const seconds = time.seconds.toString().padStart(2, '0');
      return showSeconds
        ? `${hours}:${minutes}:${seconds}`
        : `${hours}:${minutes}`;
    },
    [showSeconds]
  );

  // Parse time from input string
  const parseTimeFromInput = useCallback(
    (timeString: string) => {
      const parts = timeString.split(':');

      return {
        hours: Number.parseInt(parts[0] || '0', 10),
        minutes: Number.parseInt(parts[1] || '0', 10),
        seconds: showSeconds ? Number.parseInt(parts[2] || '0', 10) : 0,
      };
    },
    [showSeconds]
  );

  // Type guard for Date objects
  const isDate = (value: unknown): value is Date => value instanceof Date;

  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field, fieldState }) => {
        // Get current time from field value or use default
        const currentTime =
          field.value && isDate(field.value)
            ? extractTimeFromDate(field.value)
            : defaultTime;

        // Handle date selection
        const handleDateSelect = (selectedDate: Date | undefined) => {
          if (!selectedDate) {
            field.onChange(undefined);
            return;
          }

          if (enableTimePicker && field.value && isDate(field.value)) {
            // Preserve existing time when changing date
            const existingTime = extractTimeFromDate(field.value);
            field.onChange(createDateWithTime(selectedDate, existingTime));
          } else {
            // Set time to default when time picker is disabled or no existing value
            field.onChange(createDateWithTime(selectedDate, defaultTime));
          }
        };

        // Handle time change
        const handleTimeChange = (timeString: string) => {
          if (!(field.value && isDate(field.value))) {
            return;
          }

          const newTime = parseTimeFromInput(timeString);
          const newDate = createDateWithTime(field.value, newTime);
          field.onChange(newDate);
        };

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>

            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    className={cn(
                      'min-w-[240px] pl-3 text-left font-normal',
                      !field.value && 'text-muted-foreground'
                    )}
                    variant={'outline'}
                  >
                    {field.value ? (
                      enableTimePicker ? (
                        format.dateTime(field.value, {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })
                      ) : (
                        format.dateTime(field.value, { dateStyle: 'medium' })
                      )
                    ) : (
                      <span>{placeholder}</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-full p-2">
                <Calendar
                  captionLayout="dropdown"
                  disabled={disableDate}
                  mode="single"
                  onSelect={handleDateSelect}
                  selected={field.value}
                  {...props}
                />

                {/* Time Picker Section */}
                {enableTimePicker && field.value && (
                  <div className="mt-3 border-t pt-3">
                    <div className="mb-2 flex items-center gap-2">
                      <ClockIcon className="h-4 w-4" />
                      <span className="font-medium text-sm">Time</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        className="flex-1"
                        onChange={(e) => handleTimeChange(e.target.value)}
                        step={showSeconds ? 1 : 60}
                        type="time"
                        value={formatTimeForInput(currentTime)}
                      />
                    </div>
                  </div>
                )}
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
