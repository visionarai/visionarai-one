'use client';

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Textarea } from '@visionarai-one/ui';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

export type TextareaFieldProps<T extends FieldValues> = React.ComponentProps<'textarea'> & {
	name: FieldPath<T>;
	label: string;
	formControl: Control<T>;
	placeholder?: string;
	description?: string;
};

export function TextAreaFormField<T extends FieldValues>({ name, label, formControl, placeholder, description, ...props }: TextareaFieldProps<T>) {
	return (
		<FormField
			control={formControl}
			name={name}
			render={({ field, fieldState }) => (
				<FormItem>
					<FormLabel>{label}</FormLabel>
					<FormControl>
						<Textarea className="resize-none" placeholder={placeholder} {...field} {...props} />
					</FormControl>
					{description && !fieldState.error && <FormDescription>{description}</FormDescription>}
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
