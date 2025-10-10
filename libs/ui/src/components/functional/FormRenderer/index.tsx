/** biome-ignore-all lint/suspicious/noExplicitAny: TODO: remove */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, type PasswordRequirementProps, Skeleton } from "@visionarai-one/ui";
import { cn } from "@visionarai-one/utils";
import type { ComponentPropsWithoutRef } from "react";
import type { Control, DefaultValues, FieldValues, Resolver, SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import type { z } from "zod/v4";
import { FieldRenderer } from "./field-renderer";
import { extractFieldConfigsFromSchema } from "./types";

export * from "./types";

// Make the component generic over a Zod schema type S and infer the form values from it.
type FormRendererProps<S extends z.ZodType<FieldValues, any, any>> = {
	formSchema: S; // required: used to auto-extract fields and attach zodResolver
	onSubmit: (data: z.infer<S>) => void;
	defaultValues?: DefaultValues<z.infer<S>>;
	passwordRequirements?: PasswordRequirementProps[];
	submitButtonText?: string;
	submitButtonIcon?: React.ReactNode;
	resetButtonText?: string;
	resetButtonIcon?: React.ReactNode;
	debugMode?: boolean; // when true, shows form state below the form for debugging
	isLoading?: boolean; // when true, disables the submit button
	className?: ComponentPropsWithoutRef<"form">["className"];
};

export function FormRenderer<S extends z.ZodType<FieldValues, any, any>>({
	formSchema,
	passwordRequirements,
	onSubmit,
	defaultValues,
	submitButtonText = "Submit",
	submitButtonIcon,
	resetButtonText = "Reset",
	resetButtonIcon,
	debugMode = false,
	isLoading = false,
	className,
}: FormRendererProps<S>) {
	type FormValues = z.infer<S>;

	const form = useForm<FormValues>({
		defaultValues,
		mode: "onBlur",
		resetOptions: {
			keepDefaultValues: true,
			keepDirtyValues: false,
		},
		resolver: zodResolver(formSchema) as unknown as Resolver<FormValues>,
	});

	const extractedFields = extractFieldConfigsFromSchema(formSchema).filter((field) => field.name);

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
				<div className={cn("space-y-6", className)}>
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
				<form className={cn("space-y-6", className)} onSubmit={form.handleSubmit(onSubmit as SubmitHandler<FormValues>)}>
					{extractedFields.map((fieldMetadata) => (
						<FieldRenderer
							fieldMetadata={fieldMetadata.type === "password" ? { ...fieldMetadata, passwordRequirements } : fieldMetadata}
							formControl={form.control as unknown as Control<FormValues>}
							key={fieldMetadata.name}
						/>
					))}
					<div className="flex w-full gap-4">
						<Button className="flex-1" disabled={isLoading || form.formState.isSubmitting} type="submit" variant="default">
							{submitButtonIcon}
							{submitButtonText}
						</Button>
						<Button className="flex-1" disabled={isLoading || form.formState.isSubmitting} onClick={() => form.reset()} type="button" variant="secondary">
							{resetButtonIcon}
							{resetButtonText}
						</Button>
					</div>
				</form>
			)}
		</Form>
	);
}
