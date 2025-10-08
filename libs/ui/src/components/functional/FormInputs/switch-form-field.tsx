"use client";

import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldLabel,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Switch,
} from "@visionarai-one/ui";
import type { ComponentProps } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

export type SwitchFormFieldProps<T extends FieldValues> = Omit<ComponentProps<typeof Switch>, "name"> & {
	name: FieldPath<T>;
	label: string;
	formControl: Control<T>;
	description?: string;
};

export const SwitchFormField = <T extends FieldValues>({ name, label, formControl, description, ...props }: SwitchFormFieldProps<T>) => (
	<FormField
		control={formControl}
		name={name}
		render={({ field, fieldState }) => (
			<FormItem className="rounded-lg border p-4">
				<Field orientation="horizontal">
					<FieldContent>
						<FieldLabel htmlFor={`select-${name}`}>
							<FormLabel>{label}</FormLabel>
						</FieldLabel>
						<FieldDescription>{description && !fieldState.error && <FormDescription>{description}</FormDescription>}</FieldDescription>
					</FieldContent>
					<FormControl>
						<Switch checked={field.value} onCheckedChange={field.onChange} {...props} />
					</FormControl>
				</Field>
				<FieldError>
					<FormMessage />
				</FieldError>
			</FormItem>
		)}
	/>
);
