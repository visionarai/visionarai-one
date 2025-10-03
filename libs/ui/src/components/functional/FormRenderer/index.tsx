/** biome-ignore-all lint/suspicious/noExplicitAny: TODO: remove */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, type PasswordRequirementProps, Skeleton } from "@visionarai-one/ui";
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
	debugMode?: boolean; // when true, shows form state below the form for debugging
	isLoading?: boolean; // when true, disables the submit button
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
	debugMode = false,
	isLoading = false,
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
			{debugMode && (
				// SHow error below the form for debugging
				<div className="rounded-md border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900/70">
					<pre className="whitespace-pre-wrap break-all font-mono text-sm text-zinc-800 dark:text-zinc-100">
						{JSON.stringify({ dirtyFields: form.formState.dirtyFields, errors: form.formState.errors, values: form.getValues() }, null, 2)}
					</pre>
				</div>
			)}
			{isLoading ? (
				<div className="space-y-8">
					{extractedFields.map((fieldMetadata) => (
						<div className="space-y-2" key={fieldMetadata.name}>
							<Skeleton className="h-4 w-1/3" />
							<Skeleton className="h-10 w-full" />
						</div>
					))}
					<div className="flex w-full gap-4">
						<Skeleton className="h-10 w-24" />
						<Skeleton className="h-10 w-24" />
					</div>
				</div>
			) : (
				<form className="space-y-8" onSubmit={form.handleSubmit(onSubmit as SubmitHandler<TFieldValues>)}>
					{extractedFields.map((fieldMetadata) => (
						<FieldRenderer
							fieldMetadata={fieldMetadata.type === "password" ? { ...fieldMetadata, passwordRequirements } : fieldMetadata}
							formControl={form.control as unknown as Control<TFieldValues>}
							key={fieldMetadata.name}
						/>
					))}
					<div className="flex w-full gap-4">
						<Button className="flex items-center justify-center gap-2" disabled={isLoading || form.formState.isSubmitting} type="submit" variant="default">
							{submitButtonIcon}
							{submitButtonText}
						</Button>
						<Button
							className="flex items-center justify-center gap-2"
							disabled={isLoading || form.formState.isSubmitting}
							onClick={() => form.reset()}
							type="button"
							variant="secondary"
						>
							{resetButtonIcon}
							{resetButtonText}
						</Button>
					</div>
				</form>
			)}
		</Form>
	);
}
