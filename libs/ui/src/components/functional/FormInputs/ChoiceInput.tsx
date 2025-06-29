'use client';

import {
  Checkbox,
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
 * @param multiple If true, allows multiple selections (checkboxes)
 */
export type ChoiceProps<T extends FieldValues> = {
  name: FieldPath<T>;
  label: string;
  formControl: Control<T>;
  options: SelectOption[];
  placeholder?: string;
  description?: string;
  multiple?: boolean;
};

/**
 * Determines which input type to show based on the number of options.
 * @param numberOfOptions Number of options to choose from
 * @returns 'Select' if options >= 5, otherwise 'RadioGroup'
 */
const getInputType = (numberOfOptions: number): 'Select' | 'RadioGroup' => (numberOfOptions >= 5 ? 'Select' : 'RadioGroup');

/**
 * Choice input that renders a select, radio group, or checkbox group based on options length and multiple prop.
 */
export function Choice<T extends FieldValues>({ name, label, formControl, options, placeholder, description, multiple = false }: ChoiceProps<T>) {
  const numberOfOptions = options.length;
  const inputType = useMemo(() => (multiple ? 'CheckboxGroup' : getInputType(numberOfOptions)), [multiple, numberOfOptions]);

  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          {inputType === 'Select' && (
            <MemoizedChoiceSelect
              field={field}
              placeholder={placeholder}
              options={options}
            />
          )}
          {inputType === 'RadioGroup' && (
            <MemoizedChoiceRadioGroup
              field={field}
              options={options}
            />
          )}
          {inputType === 'CheckboxGroup' && (
            <ChoiceCheckboxGroup
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

/**
 * Checkbox group input for multiple choices.
 */
function ChoiceCheckboxGroup<T extends FieldValues>({ field, options }: Omit<ChoiceInputComponentProps<T>, 'placeholder'>) {
  return (
    <div className="flex flex-col gap-2">
      {options.map(option => (
        <FormItem
          key={option.value}
          className="flex flex-row items-center gap-2">
          <FormControl>
            <Checkbox
              checked={Array.isArray(field.value) ? field.value.includes(option.value) : false}
              onCheckedChange={checked => {
                if (!Array.isArray(field.value)) return;
                field.onChange(checked ? [...field.value, option.value] : field.value.filter((v: string) => v !== option.value));
              }}
              disabled={option.disabled}
            />
          </FormControl>
          <FormLabel className="text-sm font-normal">{option.label}</FormLabel>
        </FormItem>
      ))}
    </div>
  );
}
