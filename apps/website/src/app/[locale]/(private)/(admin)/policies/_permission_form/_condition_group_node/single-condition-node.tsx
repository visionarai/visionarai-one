import {
	type Cardinality,
	FIELD_SCOPE_KINDS,
	OPERATION_FOR_TYPE,
	type PermissionType,
	SCALAR_VALUE_TYPES,
	SCOPE_TYPE_ATTRIBUTE_MAP,
	type ScalarValueType,
	type ScopeTypeAttributeMap,
	VALUE_SCOPE_KINDS,
} from "@visionarai-one/abac";
import { Button, ChoiceFormField, DateTimeFormField, InputFormField, SwitchFormField } from "@visionarai-one/ui";
import { cn } from "@visionarai-one/utils";
import { Copy, Trash2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { type Control, type FieldPath, type FieldValues, useFormContext } from "react-hook-form";

const isFieldScope = (v: unknown): v is keyof ScopeTypeAttributeMap => typeof v === "string" && (FIELD_SCOPE_KINDS as readonly string[]).includes(v as string);
const isScalarValueType = (v: unknown): v is ScalarValueType => typeof v === "string" && (SCALAR_VALUE_TYPES as readonly string[]).includes(v as string);

type SingleConditionNodeProps = React.ComponentPropsWithoutRef<"div"> & {
	name: FieldPath<PermissionType>;
	onRemove?: () => void;
	onCopy?: () => void;
};

export function SingleConditionNode({ name, onRemove, onCopy, className, ...props }: SingleConditionNodeProps) {
	const formContext = useFormContext<PermissionType>();

	const fieldScope = formContext.watch(`${name}.field.scope` as FieldPath<PermissionType>);
	const fieldType = formContext.watch(`${name}.field.type` as FieldPath<PermissionType>);
	const fieldName = formContext.watch(`${name}.field.name` as FieldPath<PermissionType>);
	const operation = formContext.watch(`${name}.operation` as FieldPath<PermissionType>);
	const cardinality = formContext.watch(`${name}.value.cardinality` as FieldPath<PermissionType>);
	const valueScope = formContext.watch(`${name}.value.scope` as FieldPath<PermissionType>);

	// when scope->name changes, update inferred type
	useEffect(() => {
		if (isFieldScope(fieldScope) && fieldName) {
			const typeMap = SCOPE_TYPE_ATTRIBUTE_MAP[fieldScope];
			const nextType = typeMap[fieldName as keyof typeof typeMap];
			if (nextType) {
				formContext.setValue(`${name}.field.type` as FieldPath<PermissionType>, nextType as ScalarValueType);
			}
		}
	}, [fieldScope, fieldName, formContext.setValue, name]);

	// infer cardinality from type+operation
	useEffect(() => {
		let nextCardinality: Cardinality = "one";
		if (isScalarValueType(fieldType)) {
			const ops = OPERATION_FOR_TYPE[fieldType] as Array<{ name: string; cardinality: Cardinality }>;
			nextCardinality = ops.find((op) => op.name === operation)?.cardinality ?? "one";
		}
		formContext.setValue(`${name}.value.cardinality` as FieldPath<PermissionType>, nextCardinality);
	}, [fieldType, operation, formContext.setValue, name]);

	const valueNameOptions = useMemo(() => {
		if (!isFieldScope(valueScope)) {
			return [];
		}
		return Object.keys(SCOPE_TYPE_ATTRIBUTE_MAP[valueScope]).filter((attributes) => {
			return SCOPE_TYPE_ATTRIBUTE_MAP[valueScope][attributes as keyof (typeof SCOPE_TYPE_ATTRIBUTE_MAP)[typeof valueScope]] === fieldType;
		});
	}, [valueScope, fieldType]);

	return (
		<div className={cn("items-end-safe flex flex-wrap gap-6 p-4 [&>:not(:last-child)]:flex-1", className)} {...props}>
			<div className="flex items-center gap-6 [&>*]:flex-1">
				<ChoiceFormField
					assumeMoreOptions
					formControl={formContext.control}
					label="Field Scope"
					name={`${name}.field.scope` as FieldPath<PermissionType>}
					options={FIELD_SCOPE_KINDS.map((type) => ({ label: type, value: type }))}
				/>

				<ChoiceFormField
					assumeMoreOptions
					formControl={formContext.control}
					label="Field Name"
					name={`${name}.field.name` as FieldPath<PermissionType>}
					options={(isFieldScope(fieldScope) ? Object.keys(SCOPE_TYPE_ATTRIBUTE_MAP[fieldScope]) : []).map((type) => ({ label: type, value: type }))}
				/>
			</div>

			<ChoiceFormField
				assumeMoreOptions
				formControl={formContext.control}
				label="Operation"
				name={`${name}.operation` as FieldPath<PermissionType>}
				options={(isScalarValueType(fieldType) ? OPERATION_FOR_TYPE[fieldType] : OPERATION_FOR_TYPE.string).map((op) => ({ label: op.name, value: op.name }))}
			/>

			<div className="flex items-center gap-6 [&>*]:flex-1">
				{cardinality === "one" && (
					<>
						<ChoiceFormField
							assumeMoreOptions
							formControl={formContext.control}
							label="Value Scope"
							name={`${name}.value.scope` as FieldPath<PermissionType>}
							options={VALUE_SCOPE_KINDS.filter(
								(kind) => kind === "literal" || Object.values(SCOPE_TYPE_ATTRIBUTE_MAP[kind as keyof ScopeTypeAttributeMap]).some((d) => d === fieldType)
							).map((type) => ({ label: type, value: type }))}
						/>

						{valueScope !== "literal" ? (
							<ChoiceFormField
								assumeMoreOptions
								formControl={formContext.control}
								label="Value Name"
								name={`${name}.value.name` as FieldPath<PermissionType>}
								options={valueNameOptions.map((v) => ({ label: v, value: v }))}
							/>
						) : (
							<LiteralInput
								fieldType={isScalarValueType(fieldType) ? fieldType : undefined}
								formControl={formContext.control}
								name={`${name}.value.value` as FieldPath<PermissionType>}
							/>
						)}
					</>
				)}

				{cardinality === "range" && (
					<>
						<LiteralInput
							fieldType={isScalarValueType(fieldType) ? fieldType : undefined}
							formControl={formContext.control}
							label="Start"
							name={`${name}.value.start` as FieldPath<PermissionType>}
						/>
						<LiteralInput
							fieldType={isScalarValueType(fieldType) ? fieldType : undefined}
							formControl={formContext.control}
							label="End"
							name={`${name}.value.end` as FieldPath<PermissionType>}
						/>
					</>
				)}
			</div>

			<div className="flex h-full gap-2">
				<Button
					className="text-primary"
					onClick={(e) => {
						e.preventDefault();
						onCopy?.();
					}}
					size="icon"
					type="submit"
					variant="outline"
				>
					<Copy />
				</Button>
				<Button
					className="text-destructive"
					onClick={(e) => {
						e.preventDefault();
						onRemove?.();
					}}
					size="icon"
					type="submit"
					variant="outline"
				>
					<Trash2 />
				</Button>
			</div>
		</div>
	);
}

type LiteralInputProps<T extends FieldValues> = {
	fieldType?: ScalarValueType;
	formControl: Control<T>;
	name: FieldPath<T>;
	label?: string;
};

const LiteralInput = <T extends FieldValues>({ fieldType, formControl, name, label = "Value" }: LiteralInputProps<T>) => {
	if (!fieldType) {
		return null;
	}
	switch (fieldType) {
		case "string":
			return <InputFormField formControl={formControl} label={label} name={name} />;
		case "number":
			return <InputFormField formControl={formControl} label={label} name={name} type="number" />;
		case "boolean":
			return <SwitchFormField formControl={formControl} label={label} name={name} />;
		case "Date":
			return <DateTimeFormField formControl={formControl} label={label} name={name} />;
		default:
			return null;
	}
};
