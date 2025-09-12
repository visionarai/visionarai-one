import { ALL_TYPE_OF_VALUE_OPTIONS, OPERATION_TYPES } from "@visionarai-one/access-control";
import { Button, ChoiceFormField, FormLabel, InputFormField } from "@visionarai-one/ui";
import { X } from "lucide-react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { useWatch } from "react-hook-form";

// Regex constants for performance (compiled once)
const camelCaseRegex = /([a-z])([A-Z])/g;
const firstCharRegex = /^./;

// Helper function to convert camelCase to Title Case
const toTitleCase = (str: string): string => {
	return str
		.replace(camelCaseRegex, "$1 $2") // Insert space before capital letters
		.replace(firstCharRegex, (char) => char.toUpperCase()); // Capitalize first letter
};

export type RenderConditionFieldsProps<T extends FieldValues> = React.ComponentPropsWithoutRef<"div"> & {
	formControl: Control<T>;
	name: FieldPath<T>;
	label?: string;
	onRemove?: () => void;
};

export function RenderConditionFields<T extends FieldValues>({ formControl, name, label, onRemove, ...props }: RenderConditionFieldsProps<T>) {
	// Reactively watch the current typeOfValue so the operations list updates when it changes
	const typeOfValue = useWatch({ control: formControl, name: `${name}.typeOfValue` as FieldPath<T> }) as keyof typeof OPERATION_TYPES | undefined;

	const operationOptions = typeOfValue ? (OPERATION_TYPES[typeOfValue] ?? []).map((op) => ({ label: toTitleCase(op), value: op })) : [];

	// NOTE: We intentionally don't auto-reset the operation field here to avoid overwriting user input mid-interaction.
	// If needed, the parent form can validate/clear an invalid operation when typeOfValue changes.
	return (
		<div className="space-y-2">
			<FormLabel>{label ?? "Condition"}</FormLabel>
			<div className="flex gap-2 border-2 px-4 pt-4 pb-2 [&>:not(:last-child)]:flex-1" {...props}>
				<ChoiceFormField
					assumeMoreOptions
					formControl={formControl}
					label="Field"
					name={`${name}.field` as FieldPath<T>}
					options={[
						{ label: "Subject ID", value: "subject._id" },
						{ label: "Current Workspace ID", value: "subject.currentWorkspaceId" },
					]}
				/>
				<ChoiceFormField
					assumeMoreOptions
					formControl={formControl}
					label="Type of Value"
					name={`${name}.typeOfValue` as FieldPath<T>}
					options={ALL_TYPE_OF_VALUE_OPTIONS}
				/>
				<ChoiceFormField
					assumeMoreOptions
					formControl={formControl}
					label="Operation"
					name={`${name}.operation` as FieldPath<T>}
					options={operationOptions}
					placeholder="Select operation"
				/>
				<InputFormField formControl={formControl} label="Value" name={`${name}.value` as FieldPath<T>} placeholder="Enter value" />

				<Button
					className="mt-6 ml-2 self-start"
					onClick={(e) => {
						e.preventDefault();
						onRemove?.();
					}}
					size="icon"
					variant="destructive"
				>
					<X />
				</Button>
			</div>
		</div>
	);
}
