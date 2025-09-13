"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type MasterDataType, MasterDataZodSchema } from "@visionarai-one/abac";
import { Button, Form, InputFormField } from "@visionarai-one/ui";
import { PlusIcon, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { type SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { AttributeInput } from "./attribute-input";
import { PermissionsInput } from "./permissions-input";

type MasterDataFormProps = {
	defaultValues?: MasterDataType;
};

export default function MasterDataForm({ defaultValues }: MasterDataFormProps) {
	const t = useTranslations("MasterData");
	const form = useForm<MasterDataType>({
		defaultValues: defaultValues || {
			resources: [],
		},
		resolver: zodResolver(MasterDataZodSchema),
	});

	const onSubmit = (data: MasterDataType) => {
		// In real impl replace with mutation call
		alert(`${t("page.submit")}\n${JSON.stringify(data, null, 2)}`);
	};

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "resources",
	});

	return (
		<div className="space-y-6">
			<header className="flex flex-wrap items-center justify-between gap-3">
				<h2 className="font-semibold text-base tracking-tight">{t("page.resources")}</h2>
				<Button onClick={() => append({ name: "" })} size="sm" type="button">
					<PlusIcon className="mr-1 size-4" />
					{t("page.addResource")}
				</Button>
			</header>

			{fields.length === 0 && (
				<p className="rounded-md bg-muted/30 px-4 py-6 text-center text-muted-foreground text-sm" data-testid="empty-resources-hint">
					{t("page.noResources")}
				</p>
			)}

			<Form {...form}>
				<form className="space-y-6" onSubmit={form.handleSubmit(onSubmit as SubmitHandler<MasterDataType>)}>
					<ul className="space-y-4">
						{fields.map((field, index) => (
							<li
								aria-label={`Resource ${index + 1}`}
								className="group relative rounded-xl border border-border/40 bg-card/60 p-5 shadow-sm ring-1 ring-transparent transition-colors focus-within:ring-ring/30 hover:bg-card"
								key={field.id}
							>
								<div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
									<Button
										aria-label={t("page.removeResource")}
										className="h-7 w-7 text-muted-foreground hover:text-destructive"
										onClick={() => remove(index)}
										size="icon"
										type="button"
										variant="ghost"
									>
										<Trash2 className="size-4" />
									</Button>
								</div>
								<div className="grid gap-6 md:grid-cols-3">
									<div className="flex flex-col gap-2 md:col-span-1">
										<p className="font-medium text-[11px] text-muted-foreground/80 uppercase tracking-wide">{t("page.resourceNameLabel")}</p>
										<InputFormField
											formControl={form.control}
											label={undefined}
											name={`resources.${index}.name`}
											placeholder={t("page.resourceNamePlaceholder")}
										/>
									</div>
									<div className="md:col-span-1">
										<AttributeInput formControl={form.control} resourceIndex={index} />
									</div>
									<div className="md:col-span-1">
										<PermissionsInput formControl={form.control} resourceIndex={index} />
									</div>
								</div>
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
