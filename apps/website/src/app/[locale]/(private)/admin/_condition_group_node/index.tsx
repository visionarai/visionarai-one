import { CONDITIONS_LOGIC, type ConditionsType, type PermissionType } from "@visionarai-one/abac";
import { Button, ChoiceFormField } from "@visionarai-one/ui";
import { cn } from "@visionarai-one/utils";
import { Trash2 } from "lucide-react";
import { type FieldArrayPath, type FieldPath, type FieldPathByValue, useFieldArray, useFormContext } from "react-hook-form";
import { SingleConditionNode } from "./single-condition-node";

type ConditionGroupNodeProps = React.ComponentPropsWithoutRef<"div"> & {
	name: FieldPathByValue<PermissionType, ConditionsType>;
	onRemove?: () => void;
};
export function ConditionGroupNode({ name, onRemove, className, ...props }: ConditionGroupNodeProps) {
	const formContext = useFormContext<PermissionType>();
	// name = name ? `${name}.conditions` : "conditions";
	const { fields, append, remove, insert } = useFieldArray<PermissionType, FieldArrayPath<PermissionType>>({
		control: formContext.control,
		name: `${name}.conditions` as FieldArrayPath<PermissionType>,
	});

	const conditionBorderColor = cn(
		{
			"border-green-400": formContext.getValues(`${name}.logic`) === "AND",
			"border-red-400": formContext.getValues(`${name}.logic`) === "NOT",
			"border-yellow-400": formContext.getValues(`${name}.logic`) === "OR",
		},
		"ml-8 border-l-2 p-4 pl-8"
	);
	return (
		<div className={className} {...props}>
			<div className="items-end-safe mb-2 flex flex-row gap-4">
				<ChoiceFormField
					assumeMoreOptions
					formControl={formContext.control}
					label={""}
					name={`${name}.logic` as FieldPath<PermissionType>}
					options={CONDITIONS_LOGIC.map((opt) => ({ label: opt, value: opt }))}
				/>
				<span className="flex-1" />

				<div className="mt-2 flex flex-row gap-2">
					<Button
						onClick={() => {
							append({ conditions: [], logic: "AND" } as ConditionsType);
						}}
						variant="outline"
					>
						+ <span>Add Condition Group</span>
					</Button>

					<Button
						onClick={() => {
							append({
								field: { name: "id", scope: "user", type: "string" },
								operation: "equals",
								value: { cardinality: "one", scope: "literal", value: "" },
							});
						}}
						variant="outline"
					>
						+ <span>Add Single Condition</span>
					</Button>

					<Button
						disabled={!onRemove}
						onClick={(e) => {
							e.preventDefault();
							onRemove?.();
						}}
						variant="destructive"
					>
						<Trash2 className="h-4 w-4" /> Remove Group
					</Button>
				</div>
			</div>

			{fields.map((field, index) => {
				const fieldName = `${name}.conditions.${index}` as FieldPath<PermissionType>;
				const itemLogic = formContext.getValues(`${fieldName}.logic` as FieldPath<PermissionType>);
				const isGroup = typeof itemLogic === "string";
				if (!isGroup) {
					return (
						<SingleConditionNode
							className={conditionBorderColor}
							key={field.id}
							name={fieldName as FieldPath<PermissionType>}
							onCopy={() => {
								const current = formContext.getValues(fieldName as FieldPath<PermissionType>) as ConditionsType;
								insert(index + 1, current);
							}}
							onRemove={() => remove(index)}
						/>
					);
				}

				return (
					<ConditionGroupNode
						className={conditionBorderColor}
						key={field.id}
						name={fieldName as FieldPathByValue<PermissionType, ConditionsType>}
						onRemove={() => remove(index)}
					/>
				);
			})}
		</div>
	);
}
