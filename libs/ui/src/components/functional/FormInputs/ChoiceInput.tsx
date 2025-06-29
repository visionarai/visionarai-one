'use client';

import {
  Button,
  Checkbox,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Popover,
  PopoverContent,
  PopoverTrigger,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@visionarai-one/ui';
import { cn } from '@visionarai-one/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useMemo } from 'react';
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
  emptyText?: string; // Optional prop for empty state text
};

/**
 * Determines which input type to show based on the number of options and multiple prop.
 * @param numberOfOptions Number of options to choose from
 * @param multiple Whether multiple selection is enabled
 * @returns 'Combobox' if single select and options >= 10, 'CheckboxGroup' if multiple, 'Select' or 'RadioGroup' otherwise
 */
const getInputType = (numberOfOptions: number, multiple: boolean): 'Combobox' | 'CheckboxGroup' | 'Select' | 'RadioGroup' => {
  if (multiple) return 'CheckboxGroup';
  if (numberOfOptions >= 10) return 'Combobox';
  return numberOfOptions >= 5 ? 'Select' : 'RadioGroup';
};

/**
 * Choice input that renders a select, radio group, or checkbox group based on options length and multiple prop.
 */
export function Choice<T extends FieldValues>({ name, label, formControl, options, placeholder, description, multiple = false, emptyText }: ChoiceProps<T>) {
  const numberOfOptions = options.length;
  const inputType = useMemo(() => getInputType(numberOfOptions, multiple), [multiple, numberOfOptions]);

  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          {inputType === 'Combobox' && (
            <ChoiceCombobox
              field={field}
              options={options}
              placeholder={placeholder}
              emptyText={emptyText}
            />
          )}
          {inputType === 'Select' && (
            <ChoiceSelect
              field={field}
              placeholder={placeholder}
              options={options}
            />
          )}
          {inputType === 'RadioGroup' && (
            <ChoiceRadioGroup
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

/**
 * Combobox input for single select with many options.
 */
function ChoiceCombobox<T extends FieldValues>({ field, options, placeholder, emptyText }: ChoiceInputComponentProps<T> & { emptyText?: string }) {
  const selectedOption = options.find(option => option.value === field.value);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}>
            {selectedOption ? selectedOption.label : placeholder || 'Select option'}
            <ChevronsUpDown className="opacity-50 ml-2 h-4 w-4 shrink-0" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder={placeholder || 'Search...'}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>{emptyText || 'No option found.'}</CommandEmpty>
            <CommandGroup>
              {options.map(option => (
                <CommandItem
                  value={option.label}
                  key={option.value}
                  onSelect={() => field.onChange(option.value)}
                  disabled={option.disabled}>
                  {option.label}
                  <Check className={cn('ml-auto', option.value === field.value ? 'opacity-100' : 'opacity-0')} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
