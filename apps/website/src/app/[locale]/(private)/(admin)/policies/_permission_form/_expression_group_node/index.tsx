import { CONDITIONS_LOGIC, type ExpressionGroupType, type PermissionType } from "@visionarai-one/abac";
import { Button, ChoiceFormField, FormControl, FormField, FormItem, FormMessage } from "@visionarai-one/ui";
import { cn } from "@visionarai-one/utils";
import { Plus, Trash2 } from "lucide-react";
import { type FieldArrayPath, type FieldPath, type FieldPathByValue, useFieldArray, useFormContext } from "react-hook-form";
import { conditionGroupLeftBorderColor } from "../../_components/utils";
import { SingleConditionNode } from "./expression-node";

type ConditionGroupNodeProps = React.ComponentPropsWithoutRef<"div"> & {
	name: FieldPathByValue<PermissionType, ExpressionGroupType>;
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
		append({ expressions: [], logic: "AND" } as ExpressionGroupType);
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
		<div className={cn(className, "transition-all duration-200 ease-in-out")} {...props}>
			<div className="items-end-safe mb-2 flex flex-row gap-4">
				<ChoiceFormField
					assumeMoreOptions
					formControl={formContext.control}
					label={""}
					name={`${name}.logic` as FieldPath<PermissionType>}
					options={CONDITIONS_LOGIC.map((opt) => ({ label: opt, value: opt }))}
					placeholder="Logic"
				/>
				<span className="flex-1" />

				<div className="mt-2 flex flex-row gap-2">
					<Button onClick={handleAddGroup} variant="outline">
						<Plus />
						<span>Add Group</span>
					</Button>

					<Button onClick={handleAddSingle} variant="outline">
						<Plus />
						<span>Add Expression</span>
					</Button>

					<Button
						disabled={!onRemove}
						onClick={(e) => {
							e.preventDefault();
							onRemove?.();
						}}
						variant="borderedDestructive"
					>
						<Trash2 className="h-4 w-4" /> Remove Group
					</Button>
				</div>
			</div>

			<FormField
				control={formContext.control}
				name={`${name}.expressions`}
				render={() => (
					<FormItem>
						<FormControl>
							<div>
								{fields.map((field, index) => {
									const fieldName = `${name}.expressions.${index}` as FieldPath<PermissionType>;
									const itemLogic = formContext.getValues(`${fieldName}.logic` as FieldPath<PermissionType>);
									const childIsGroup = typeof itemLogic === "string";

									if (childIsGroup) {
										return (
											<ConditionGroupNode
												className={conditionBorderColor}
												key={field.id}
												name={fieldName as FieldPathByValue<PermissionType, ExpressionGroupType>}
												onRemove={() => remove(index)}
											/>
										);
									}

									return (
										<SingleConditionNode
											className={conditionBorderColor}
											key={field.id}
											name={fieldName as FieldPath<PermissionType>}
											onCopy={() => {
												const current = formContext.getValues(fieldName as FieldPath<PermissionType>) as ExpressionGroupType;
												insert(index + 1, current);
											}}
											onRemove={() => remove(index)}
										/>
									);
								})}
							</div>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
}
