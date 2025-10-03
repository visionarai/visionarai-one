"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ATTRIBUTE_TYPES, type MasterDataType, MasterDataZodSchema } from "@visionarai-one/abac";
import {
	Badge,
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	ChoiceFormField,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	Form,
	InputFormField,
	Separator,
	useAsyncFunction,
} from "@visionarai-one/ui";
import { ChevronDown, Database, PlusIcon, Settings, Trash2 } from "lucide-react";
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
	const [execute] = useAsyncFunction(orpcClient.masterData.update, {
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
		<Form {...form}>
			<form className="space-y-8" onSubmit={form.handleSubmit(onSubmit as SubmitHandler<MasterDataType>)}>
				{/* Resources Section */}
				<Card>
					<CardHeader className="pb-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<Database className="size-5 text-muted-foreground" />
								<div>
									<CardTitle className="text-lg">
										{t("page.resources")}
										{form.formState.isDirty && (
											<Badge className="ml-2" variant="destructive">
												{t("page.unsaved-changes")}
											</Badge>
										)}
									</CardTitle>
									<p className="mt-1 text-muted-foreground text-sm">{t("page.subtitle")}</p>
								</div>
							</div>
							<Button onClick={() => addResource({ name: "" })} size="sm" variant="outline">
								<PlusIcon className="mr-2 size-4" />
								{t("page.addResource")}
							</Button>
						</div>
					</CardHeader>
					<CardContent className="pt-0">
						{resourceFields.length === 0 ? (
							<div className="flex flex-col items-center justify-center rounded-lg border-2 border-muted-foreground/25 border-dashed bg-muted/10 py-12 text-center">
								<Database className="mb-4 size-12 text-muted-foreground/50" />
								<h3 className="mb-2 font-medium text-base">{t("page.noResources")}</h3>
								<p className="mb-4 max-w-sm text-muted-foreground text-sm">{t("page.resourceEmptyDescription")}</p>
								<Button onClick={() => addResource({ name: "" })} size="sm" variant="outline">
									<PlusIcon className="mr-2 size-4" />
									{t("page.addResource")}
								</Button>
							</div>
						) : (
							<div className="space-y-4">
								{resourceFields.map((field, index) => (
									<Collapsible defaultOpen={resourceFields.length === 1} key={field.id}>
										<div className="group relative rounded-xl border border-border/40 bg-card/60 p-4 shadow-sm transition-colors hover:bg-card">
											<div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
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

											<div className="space-y-4">
												<div className="pr-12">
													<InputFormField
														formControl={form.control}
														label={t("page.resourceNameLabel")}
														name={`resources.${index}.name`}
														placeholder={t("page.resourceNamePlaceholder")}
													/>
												</div>

												<CollapsibleTrigger asChild>
													<Button className="w-full justify-between p-0 text-left font-normal" variant="ghost">
														<span className="text-muted-foreground text-sm">{t("page.configureAttributesText")}</span>
														<ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
													</Button>
												</CollapsibleTrigger>

												<CollapsibleContent className="space-y-6">
													<Separator />
													<div className="grid gap-6 md:grid-cols-2">
														<AttributeInput formControl={form.control} resourceIndex={index} />
														<PermissionsInput formControl={form.control} resourceIndex={index} />
													</div>
												</CollapsibleContent>
											</div>
										</div>
									</Collapsible>
								))}
							</div>
						)}
					</CardContent>
				</Card>

				{/* Environment Attributes Section */}
				<Card>
					<CardHeader className="pb-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<Settings className="size-5 text-muted-foreground" />
								<div>
									<CardTitle className="text-lg">{t("page.environmentAttributes")}</CardTitle>
									<p className="mt-1 text-muted-foreground text-sm">{t("page.environmentDescriptionText")}</p>
								</div>
							</div>
							<Button onClick={() => addEnvironmentAttribute({ key: "", type: "string" })} size="sm" variant="outline">
								<PlusIcon className="mr-2 size-4" />
								{t("page.addEnvironmentAttribute")}
							</Button>
						</div>
					</CardHeader>
					<CardContent className="pt-0">
						{environmentAttributeFields.length === 0 ? (
							<div className="flex flex-col items-center justify-center rounded-lg border-2 border-muted-foreground/25 border-dashed bg-muted/10 py-12 text-center">
								<Settings className="mb-4 size-12 text-muted-foreground/50" />
								<h3 className="mb-2 font-medium text-base">{t("page.noEnvironmentAttributesTitle")}</h3>
								<p className="mb-4 max-w-sm text-muted-foreground text-sm">{t("page.environmentEmptyDescription")}</p>
								<Button onClick={() => addEnvironmentAttribute({ key: "", type: "string" })} size="sm" variant="outline">
									<PlusIcon className="mr-2 size-4" />
									{t("page.addEnvironmentAttribute")}
								</Button>
							</div>
						) : (
							<div className="space-y-4">
								{environmentAttributeFields.map((field, index) => (
									<fieldset className="flex items-end gap-3 rounded-lg border border-border/40 bg-card/30 p-4" key={field.id}>
										<legend className="sr-only">{t("page.environmentAttributeItemAriaLabel", { index: index + 1 })}</legend>
										<div className="flex-1">
											<InputFormField
												formControl={form.control}
												label={t("attributes.keyLabel")}
												name={`environmentAttributes.${index}.key`}
												placeholder={t("attributes.keyPlaceholder")}
											/>
										</div>
										<div className="flex-1">
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
										</div>
										<Button
											aria-label={t("page.removeEnvironmentAttribute")}
											className="h-10 w-10 text-muted-foreground hover:text-destructive"
											onClick={() => removeEnvironmentAttributeField(index)}
											size="icon"
											type="button"
											variant="ghost"
										>
											<Trash2 className="size-4" />
										</Button>
									</fieldset>
								))}
							</div>
						)}
					</CardContent>
				</Card>

				{/* Submit Button */}
				<div className="flex justify-end">
					<Button disabled={form.formState.isSubmitting} type="submit">
						{form.formState.isSubmitting ? t("page.savingText") : t("page.submit")}
					</Button>
				</div>
			</form>
		</Form>
	);
}
