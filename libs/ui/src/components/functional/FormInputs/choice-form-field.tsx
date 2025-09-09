"use client";

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
	MultiSelect,
	MultiSelectContent,
	MultiSelectGroup,
	MultiSelectItem,
	MultiSelectTrigger,
	MultiSelectValue,
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
} from "@visionarai-one/ui";
import { cn } from "@visionarai-one/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useMemo } from "react";
import type { Control, ControllerRenderProps, FieldPath, FieldValues, Path } from "react-hook-form";

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
export type ChoiceFormFieldProps<T extends FieldValues> = {
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
 * @returns 'MultiSelect' if multiple and options >= 10, 'CheckboxGroup' if multiple and < 10, 'Combobox' if single select and options >= 10, 'Select' or 'RadioGroup' otherwise
 */
const getInputType = (numberOfOptions: number, multiple: boolean): "MultiSelect" | "Combobox" | "CheckboxGroup" | "Select" | "RadioGroup" => {
	if (multiple) {
		if (numberOfOptions >= 10) {
			return "MultiSelect";
		}
		return "CheckboxGroup";
	}
	if (numberOfOptions >= 10) {
		return "Combobox";
	}
	return numberOfOptions >= 5 ? "Select" : "RadioGroup";
};

/**
 * Choice input that renders a select, radio group, or checkbox group based on options length and multiple prop.
 */
export function ChoiceFormField<T extends FieldValues>({
	name,
	label,
	formControl,
	options,
	placeholder,
	description,
	multiple = false,
	emptyText,
}: ChoiceFormFieldProps<T>) {
	const numberOfOptions = options.length;
	const inputType = useMemo(() => getInputType(numberOfOptions, multiple), [multiple, numberOfOptions]);

	return (
		<FormField
			control={formControl}
			name={name}
			render={({ field, fieldState }) => (
				<FormItem>
					<FormLabel>{label}</FormLabel>
					{inputType === "MultiSelect" && <ChoiceMultiSelect emptyText={emptyText} field={field} options={options} placeholder={placeholder} />}
					{inputType === "Combobox" && <ChoiceCombobox emptyText={emptyText} field={field} options={options} placeholder={placeholder} />}
					{inputType === "Select" && <ChoiceSelect field={field} options={options} placeholder={placeholder} />}
					{inputType === "RadioGroup" && <ChoiceRadioGroup field={field} options={options} />}
					{inputType === "CheckboxGroup" && <ChoiceCheckboxGroup field={field} options={options} />}
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
		<Select defaultValue={field.value} onValueChange={field.onChange}>
			<FormControl>
				<SelectTrigger className="w-full">
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
			</FormControl>
			<SelectContent>
				{options.map((option) => (
					<SelectItem disabled={option.disabled} key={option.value} value={option.value}>
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
			<RadioGroup className="flex flex-col" defaultValue={field.value} onValueChange={field.onChange}>
				{options.map((option) => (
					<FormItem className="flex items-center gap-3" key={option.value}>
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
function ChoiceCheckboxGroup<T extends FieldValues>({ field, options }: Omit<ChoiceInputComponentProps<T>, "placeholder">) {
	return (
		<div className="flex flex-col gap-2">
			{options.map((option) => (
				<FormItem className="flex flex-row items-center gap-2" key={option.value}>
					<FormControl>
						<Checkbox
							checked={Array.isArray(field.value) ? field.value.includes(option.value) : false}
							disabled={option.disabled}
							onCheckedChange={(checked) => {
								if (!Array.isArray(field.value)) {
									return;
								}
								field.onChange(checked ? [...field.value, option.value] : field.value.filter((v: string) => v !== option.value));
							}}
						/>
					</FormControl>
					<FormLabel className="font-normal text-sm">{option.label}</FormLabel>
				</FormItem>
			))}
		</div>
	);
}

/**
 * Combobox input for single select with many options.
 */
function ChoiceCombobox<T extends FieldValues>({ field, options, placeholder, emptyText }: ChoiceInputComponentProps<T> & { emptyText?: string }) {
	const selectedOption = options.find((option) => option.value === field.value);
	return (
		<Popover>
			<PopoverTrigger asChild>
				<FormControl>
					<Button className={cn("w-full justify-between", !field.value && "text-muted-foreground")} variant="outline">
						{selectedOption ? selectedOption.label : placeholder || "Select option"}
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</FormControl>
			</PopoverTrigger>
			<PopoverContent className="w-full min-w-[200px] p-0">
				<Command>
					<CommandInput className="h-9" placeholder={placeholder || "Search..."} />
					<CommandList>
						<CommandEmpty>{emptyText || "No option found."}</CommandEmpty>
						<CommandGroup>
							{options.map((option) => (
								<CommandItem disabled={option.disabled} key={option.value} onSelect={() => field.onChange(option.value)} value={option.label}>
									{option.label}
									<Check className={cn("ml-auto", option.value === field.value ? "opacity-100" : "opacity-0")} />
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

/**
 * MultiSelect input for multiple select with many options.
 */
function ChoiceMultiSelect<T extends FieldValues>({ field, options, placeholder, emptyText }: ChoiceInputComponentProps<T> & { emptyText?: string }) {
	return (
		<MultiSelect onValuesChange={field.onChange} values={field.value || []}>
			<MultiSelectTrigger className="w-full">
				<MultiSelectValue placeholder={placeholder || "Select options..."} />
			</MultiSelectTrigger>
			<MultiSelectContent>
				<MultiSelectGroup>
					{options.length === 0 ? (
						<div className="px-4 py-2 text-muted-foreground text-sm">{emptyText || "No option found."}</div>
					) : (
						options.map((option) => (
							<MultiSelectItem disabled={option.disabled} key={option.value} value={option.value}>
								{option.label}
							</MultiSelectItem>
						))
					)}
				</MultiSelectGroup>
			</MultiSelectContent>
		</MultiSelect>
	);
}
