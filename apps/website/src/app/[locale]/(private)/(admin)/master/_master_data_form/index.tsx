"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ATTRIBUTE_TYPES, type MasterDataType, MasterDataZodSchema } from "@visionarai-one/abac";
import { Badge, Button, ChoiceFormField, Form, InputFormField, useAsyncFunction } from "@visionarai-one/ui";
import { PlusIcon, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { type SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { orpcClient } from "@/lib/orpc";
import { AttributeInput } from "./attribute-input";
import { PermissionsInput } from "./permissions-input";

type MasterDataFormProps = {
	defaultValues?: MasterDataType;
};

export default function MasterDataForm({ defaultValues }: MasterDataFormProps) {
	const t = useTranslations("MasterData");
	const { execute } = useAsyncFunction(orpcClient.masterData.update, {
		successMessage: t("page.updateSuccess"),
	});
	const form = useForm<MasterDataType>({
		defaultValues: defaultValues || {
			resources: [],
		},
		resolver: zodResolver(MasterDataZodSchema),
	});

	const onSubmit = async (data: MasterDataType) => {
		await execute(data);
	};

	const {
		fields: resourceFields,
		append: addResource,
		remove: removeResourceField,
	} = useFieldArray({
		control: form.control,
		name: "resources",
	});

	const {
		fields: environmentAttributeFields,
		append: addEnvironmentAttribute,
		remove: removeEnvironmentAttributeField,
	} = useFieldArray({
		control: form.control,
		name: "environmentAttributes",
	});

	return (
		<div className="space-y-6">
			<header className="flex flex-wrap items-center justify-between gap-3">
				<h2 className="-2 font-semibold text-base tracking-tight">
					{t("page.resources")}
					{form.formState.isDirty && <Badge variant="destructive">{t("page.unsaved-changes")}</Badge>}
				</h2>
				<Button onClick={() => addResource({ name: "" })} size="sm" type="button">
					<PlusIcon className="mr-1 size-4" />
					{t("page.addResource")}
				</Button>
			</header>

			{resourceFields.length === 0 && (
				<p className="rounded-md bg-muted/30 px-4 py-6 text-center text-muted-foreground text-sm" data-testid="empty-resources-hint">
					{t("page.noResources")}
				</p>
			)}

			<Form {...form}>
				<form className="space-y-6" onSubmit={form.handleSubmit(onSubmit as SubmitHandler<MasterDataType>)}>
					<ul className="space-y-4">
						{resourceFields.map((field, index) => (
							<li
								aria-label={t("page.resourceItemAriaLabel", { index: index + 1 })}
								className="group relative rounded-xl border border-border/40 bg-card/60 p-5 shadow-sm ring-1 ring-transparent transition-colors focus-within:ring-ring/30 hover:bg-card"
								key={field.id}
							>
								<div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
									<Button
										aria-label={t("page.removeResource")}
										className="h-7 w-7 text-muted-foreground hover:text-destructive"
										onClick={() => removeResourceField(index)}
										size="icon"
										type="button"
										variant="ghost"
									>
										<Trash2 className="size-4" />
									</Button>
								</div>

								<div className="space-y-8">
									<div className="flex flex-col gap-2">
										<InputFormField
											formControl={form.control}
											label={t("page.resourceNameLabel")}
											name={`resources.${index}.name`}
											placeholder={t("page.resourceNamePlaceholder")}
										/>
									</div>
									<div className="flex flex-row gap-8 [&>*]:flex-1">
										<AttributeInput formControl={form.control} resourceIndex={index} />
										<PermissionsInput formControl={form.control} resourceIndex={index} />
									</div>
								</div>
							</li>
						))}
					</ul>

					<header className="flex flex-wrap items-center justify-between gap-3">
						<h2 className="-2 font-semibold text-base tracking-tight">
							{t("page.environmentAttributes")}
							{form.formState.isDirty && <Badge variant="destructive">{t("page.unsaved-changes")}</Badge>}
						</h2>
						<Button onClick={() => addEnvironmentAttribute({ key: "", type: "string" })} size="sm" type="button">
							<PlusIcon className="mr-1 size-4" />
							{t("page.addEnvironmentAttribute")}
						</Button>
					</header>

					<ul className="space-y-4">
						{environmentAttributeFields.map((field, index) => (
							<li
								aria-label={t("page.environmentAttributeItemAriaLabel", { index: index + 1 })}
								className="flex items-center gap-3 [&>:not(:last-child)]:flex-1"
								key={field.id}
							>
								<InputFormField
									formControl={form.control}
									label={t("attributes.keyLabel")}
									name={`environmentAttributes.${index}.key`}
									placeholder={t("attributes.keyPlaceholder")}
								/>
								<ChoiceFormField
									assumeMoreOptions
									formControl={form.control}
									label={t("attributes.typeLabel")}
									name={`environmentAttributes.${index}.type`}
									options={ATTRIBUTE_TYPES.map((type) => ({
										label: type,
										value: type,
									}))}
								/>
								<Button
									aria-label={t("page.removeEnvironmentAttribute")}
									className="mt-2 h-7 w-7 text-muted-foreground hover:text-destructive"
									onClick={() => removeEnvironmentAttributeField(index)}
									size="icon"
									type="button"
									variant="ghost"
								>
									<Trash2 className="size-4" />
								</Button>
							</li>
						))}
					</ul>

					<div className="flex justify-end gap-2">
						<Button disabled={form.formState.isSubmitting} size="sm" type="submit">
							{t("page.submit")}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
