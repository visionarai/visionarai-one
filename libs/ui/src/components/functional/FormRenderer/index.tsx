/** biome-ignore-all lint/suspicious/noExplicitAny: TODO: remove */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, type PasswordRequirementProps } from "@visionarai-one/ui";
import type { Control, DefaultValues, FieldValues, Resolver, SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import type { z } from "zod/v4";
import { FieldRenderer } from "./field-renderer";
import { extractFieldConfigsFromSchema, type FieldMetadata } from "./types";

export * from "./types";

type SchemaLike = z.ZodObject<any, any>;

type FormRendererProps<TFieldValues extends FieldValues = FieldValues> = {
	formSchema?: SchemaLike; // optional: used to auto-extract fields and attach zodResolver
	fields?: FieldMetadata[]; // when provided, overrides extraction from schema
	resolver?: Resolver<TFieldValues>;
	onSubmit: (data: TFieldValues) => void;
	defaultValues?: DefaultValues<TFieldValues>;
	passwordRequirements?: PasswordRequirementProps[];
	submitButtonText?: string;
	submitButtonIcon?: React.ReactNode;
	resetButtonText?: string;
	resetButtonIcon?: React.ReactNode;
};

export function FormRenderer<TFieldValues extends FieldValues = FieldValues>({
	formSchema,
	fields,
	resolver,
	passwordRequirements,
	onSubmit,
	defaultValues,
	submitButtonText = "Submit",
	submitButtonIcon,
	resetButtonText = "Reset",
	resetButtonIcon,
}: FormRendererProps<TFieldValues>) {
	const resolverToUse = (resolver ?? (formSchema ? (zodResolver(formSchema) as Resolver<TFieldValues>) : undefined)) as Resolver<TFieldValues> | undefined;
	const form = useForm<TFieldValues>({
		defaultValues,
		mode: "onBlur",
		resetOptions: {
			keepDefaultValues: true,
			keepDirtyValues: false,
		},
		resolver: resolverToUse,
	});

	const extractedFields = (formSchema ? extractFieldConfigsFromSchema(formSchema) : (fields ?? [])).filter((field) => field.name);

	return (
		<Form {...(form as any)}>
			<form className="space-y-8" onSubmit={form.handleSubmit(onSubmit as SubmitHandler<TFieldValues>)}>
				{extractedFields.map((fieldMetadata) => {
					return (
						<FieldRenderer
							fieldMetadata={fieldMetadata.type === "password" ? { ...fieldMetadata, passwordRequirements } : fieldMetadata}
							formControl={form.control as unknown as Control<TFieldValues>}
							key={fieldMetadata.name}
						/>
					);
				})}
				<div className="flex w-full gap-4">
					<Button className="flex items-center justify-center gap-2" type="submit" variant="default">
						{submitButtonIcon}
						{submitButtonText}
					</Button>
					<Button className="flex items-center justify-center gap-2" onClick={() => form.reset()} type="button" variant="secondary">
						{resetButtonIcon}
						{resetButtonText}
					</Button>
				</div>
			</form>
		</Form>
	);
}
