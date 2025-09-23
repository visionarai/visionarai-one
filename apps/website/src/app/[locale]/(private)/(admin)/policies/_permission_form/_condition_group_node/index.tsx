import { CONDITIONS_LOGIC, type ConditionsType, type PermissionType } from "@visionarai-one/abac";
import { Button, ChoiceFormField } from "@visionarai-one/ui";
import { Trash2 } from "lucide-react";
import { type FieldArrayPath, type FieldPath, type FieldPathByValue, useFieldArray, useFormContext } from "react-hook-form";
import { conditionGroupLeftBorderColor } from "../../_colors";
import { SingleConditionNode } from "./single-condition-node";

type ConditionGroupNodeProps = React.ComponentPropsWithoutRef<"div"> & {
	name: FieldPathByValue<PermissionType, ConditionsType>;
	onRemove?: () => void;
};
export function ConditionGroupNode({ name, onRemove, className, ...props }: ConditionGroupNodeProps) {
	const formContext = useFormContext<PermissionType>();
	const { fields, append, remove, insert } = useFieldArray<PermissionType, FieldArrayPath<PermissionType>>({
		control: formContext.control,
		name: `${name}.expressions` as FieldArrayPath<PermissionType>,
	});

	const logicValue = formContext.getValues(`${name}.logic`);
	const conditionBorderColor = conditionGroupLeftBorderColor(logicValue, "ml-8 border-l-2 p-4 pl-8");

	const handleAddGroup = (e: React.MouseEvent) => {
		e.preventDefault();
		append({ expressions: [], logic: "AND" } as ConditionsType);
	};

	const handleAddSingle = (e: React.MouseEvent) => {
		e.preventDefault();
		append({
			field: { name: "id", scope: "user", type: "string" },
			operation: "equals",
			value: { cardinality: "one", scope: "literal", value: "" },
		});
	};

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
					<Button onClick={handleAddGroup} variant="outline">
						+ <span>Add Condition Group</span>
					</Button>

					<Button onClick={handleAddSingle} variant="outline">
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
				const fieldName = `${name}.expressions.${index}` as FieldPath<PermissionType>;
				const itemLogic = formContext.getValues(`${fieldName}.logic` as FieldPath<PermissionType>);
				const childIsGroup = typeof itemLogic === "string";

				if (!childIsGroup) {
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
