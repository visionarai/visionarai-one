import { ALL_TYPE_OF_VALUE_OPTIONS } from "@visionarai-one/access-control";
import { Button, ChoiceFormField, FormLabel, FormMessage } from "@visionarai-one/ui";
import { type ArrayPath, type Control, type FieldArray, type FieldPath, type FieldValues, useFieldArray } from "react-hook-form";
import { RenderConditionFields } from "./condition-input";
export type RenderConditionGroupFieldsProps<T extends FieldValues> = React.ComponentPropsWithoutRef<"div"> & {
	formControl: Control<T>;
	name: FieldPath<T>;
	label?: string;
};

export function RenderConditionGroupFields<T extends FieldValues>({ formControl, name, label, ...props }: RenderConditionGroupFieldsProps<T>) {
	const { fields, append, remove } = useFieldArray<T>({
		control: formControl,
		name: `${name}.conditions` as ArrayPath<T>,
	});

	return (
		<div className="space-y-2" {...props}>
			<FormLabel>{label ?? "Condition Group"}</FormLabel>
			<div className="space-y-4 border-2 p-4">
				<ChoiceFormField
					assumeMoreOptions
					formControl={formControl}
					label="Type of Value"
					name={`${name}.operator` as FieldPath<T>}
					options={ALL_TYPE_OF_VALUE_OPTIONS}
				/>

				{fields.map((field, index) => (
					<RenderConditionFields formControl={formControl} key={field.id} name={`${name}.conditions.${index}` as FieldPath<T>} onRemove={() => remove(index)} />
				))}
				<Button
					onClick={(e) => {
						e.preventDefault();
						append({ field: "subject._id", operation: "equals", typeOfValue: "string", value: "" } as unknown as FieldArray<T, ArrayPath<T>>);
					}}
				>
					Add Condition
				</Button>
			</div>
			<FormMessage />
		</div>
	);
}
