"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	type ConditionNode,
	ConditionNodeSchema,
	exampleCondition,
	FIELD_SCOPE_KINDS,
	OPERATION_FOR_TYPE,
	type ScopeTypeAttributeMap,
	VALUE_SCOPE_KINDS,
} from "@visionarai-one/abac";
import { Button, ChoiceFormField, DateTimeFormField, Form, InputFormField, SwitchFormField } from "@visionarai-one/ui";
import { Check, ChevronRight, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { type Control, type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

type ConditionNodeFormProps = {
	scopeTypeAttributeMap: ScopeTypeAttributeMap;
};
export function ConditionNodeForm({ scopeTypeAttributeMap }: ConditionNodeFormProps) {
	const form = useForm<ConditionNode>({
		defaultValues: exampleCondition,
		resolver: zodResolver(ConditionNodeSchema),
	});

	const fieldScope = form.watch("field.scope");
	const fieldType = form.watch("field.type");
	const fieldName = form.watch("field.name");
	const operation = form.watch("operation");
	const cardinality = form.watch("value.cardinality");

	const valueScope = form.watch("value.scope");

	useEffect(() => {
		// Update field.type whenever field.scope changes
		form.setValue("field.type", scopeTypeAttributeMap[fieldScope][fieldName as keyof ScopeTypeAttributeMap[typeof fieldScope]]);
	}, [fieldScope, fieldName, form.setValue, scopeTypeAttributeMap[fieldScope][fieldName as keyof ScopeTypeAttributeMap[typeof fieldScope]]]);

	useEffect(() => {
		// Update value.cardinality whenever field.type or operation changes
		form.setValue("value.cardinality", fieldType ? (OPERATION_FOR_TYPE[fieldType].find((op) => op.name === operation)?.cardinality ?? "one") : "one");
	}, [fieldType, operation, form.setValue]);

	const onSubmit = (data: ConditionNode) => {
		toast.success(`Form submitted successfully ${JSON.stringify(data, null, 2)}`);
	};

	return (
		<div className="space-y-4 p-4">
			<h1>Condition Node Form</h1>
			<Form {...form}>
				<form
					className="flex flex-wrap items-center gap-6 rounded-md border-2 bg-background p-4 [&>:not(:last-child)]:flex-1"
					onSubmit={form.handleSubmit(onSubmit as SubmitHandler<ConditionNode>)}
				>
					<div className="flex items-center gap-6 [&>*]:flex-1">
						<ChoiceFormField
							assumeMoreOptions
							formControl={form.control}
							label="Field Scope"
							name="field.scope"
							options={FIELD_SCOPE_KINDS.map((type) => ({ label: type, value: type }))}
						/>

						<ChoiceFormField
							assumeMoreOptions
							formControl={form.control}
							label="Field Name"
							name="field.name"
							options={Object.keys(scopeTypeAttributeMap[fieldScope]).map((type) => ({ label: type, value: type }))}
						/>
						<ChevronRight />
					</div>
					<ChoiceFormField
						assumeMoreOptions
						formControl={form.control}
						label="Operation"
						name="operation"
						options={OPERATION_FOR_TYPE[fieldType ?? "string"].map((op) => ({ label: op.name, value: op.name }))}
					/>
					<div className="flex items-center gap-6 [&>*]:flex-1">
						<ChevronRight />
						{cardinality === "one" && (
							<>
								<ChoiceFormField
									assumeMoreOptions
									formControl={form.control}
									label="Value Scope"
									name="value.scope"
									options={VALUE_SCOPE_KINDS.filter(
										(kind) =>
											kind === "literal" ||
											(scopeTypeAttributeMap[kind as keyof ScopeTypeAttributeMap] &&
												Object.values(scopeTypeAttributeMap[kind as keyof ScopeTypeAttributeMap]).some((d) => d === fieldType))
									) // Only show "literal" if fieldType is set
										.map((type) => ({ label: type, value: type }))}
								/>
								{valueScope !== "literal" ? (
									<ChoiceFormField
										assumeMoreOptions
										formControl={form.control}
										label="Value Name"
										name="value.name"
										options={Object.keys(scopeTypeAttributeMap[valueScope])
											.filter((attributes) => {
												return scopeTypeAttributeMap[valueScope][attributes as keyof ScopeTypeAttributeMap[typeof valueScope]] === fieldType;
											})
											.map((attributes) => ({ label: attributes, value: attributes }))}
									/>
								) : (
									<LiteralInput fieldType={fieldType} formControl={form.control} />
								)}
							</>
						)}

						{cardinality === "range" && (
							<>
								<LiteralInput fieldType={fieldType} formControl={form.control} label="Start" name="value.start" />
								<LiteralInput fieldType={fieldType} formControl={form.control} label="End" name="value.end" />
							</>
						)}
					</div>
					<div className="flex gap-2">
						<Button className="text-primary" size="icon" type="submit" variant="outline">
							<Check />
						</Button>
						<Button className="text-destructive" size="icon" type="submit" variant="outline">
							<Trash2 />
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}

// Renders the appropriate literal input based on the field type. Kept small & data-driven.
type LiteralName = "value.value" | "value.values" | "value.start" | "value.end";
type LiteralInputProps = {
	fieldType?: string;
	formControl: Control<ConditionNode>;
	name?: LiteralName;
	label?: string;
};

const LiteralInput = ({ fieldType, formControl, name = "value.value", label = "Value" }: LiteralInputProps) => {
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
