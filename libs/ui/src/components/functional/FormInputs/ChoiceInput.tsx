'use client';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@visionarai-one/ui';
import React, { useMemo } from 'react';
import { Control, ControllerRenderProps, FieldPath, FieldValues, Path } from 'react-hook-form';

/**
 * Option for select or radio group input.
 */
export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

/**
 * Props for the Choice component.
 */
export type ChoiceProps<T extends FieldValues> = {
  name: FieldPath<T>;
  label: string;
  formControl: Control<T>;
  options: SelectOption[];
  placeholder?: string;
  description?: string;
};

/**
 * Determines which input type to show based on the number of options.
 * @param numberOfOptions Number of options to choose from
 * @returns 'Select' if options >= 5, otherwise 'RadioGroup'
 */
const getInputType = (numberOfOptions: number): 'Select' | 'RadioGroup' => (numberOfOptions >= 5 ? 'Select' : 'RadioGroup');

/**
 * Choice input that renders a select or radio group based on options length.
 */
export function Choice<T extends FieldValues>({ name, label, formControl, options, placeholder, description }: ChoiceProps<T>) {
  const numberOfOptions = options.length;
  const inputType = useMemo(() => getInputType(numberOfOptions), [numberOfOptions]);

  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          {inputType === 'Select' ? (
            <MemoizedChoiceSelect
              field={field}
              placeholder={placeholder}
              options={options}
            />
          ) : (
            <MemoizedChoiceRadioGroup
              field={field}
              options={options}
            />
          )}
          {description && !fieldState.error && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

/**
 * Props for ChoiceSelect and ChoiceRadioGroup components.
 */
type ChoiceInputComponentProps<T extends FieldValues> = {
  field: ControllerRenderProps<T, Path<T>>;
  placeholder?: string;
  options: SelectOption[];
};

/**
 * Memoized select input for choices.
 */
function ChoiceSelect<T extends FieldValues>({ field, placeholder, options }: ChoiceInputComponentProps<T>) {
  return (
    <Select
      onValueChange={field.onChange}
      defaultValue={field.value}>
      <FormControl>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {options.map(option => (
          <SelectItem
            disabled={option.disabled}
            key={option.value}
            value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
const MemoizedChoiceSelect = React.memo(ChoiceSelect) as typeof ChoiceSelect;

/**
 * Memoized radio group input for choices.
 */
function ChoiceRadioGroup<T extends FieldValues>({ field, options }: ChoiceInputComponentProps<T>) {
  return (
    <FormControl>
      <RadioGroup
        onValueChange={field.onChange}
        defaultValue={field.value}
        className="flex flex-col">
        {options.map(option => (
          <FormItem
            key={option.value}
            className="flex items-center gap-3">
            <FormControl>
              <RadioGroupItem value={option.value} />
            </FormControl>
            <FormLabel className="font-normal">{option.label}</FormLabel>
          </FormItem>
        ))}
      </RadioGroup>
    </FormControl>
  );
}
const MemoizedChoiceRadioGroup = React.memo(ChoiceRadioGroup) as typeof ChoiceRadioGroup;
