"use client";

import { ATTRIBUTE_TYPES, type MasterDataType } from "@visionarai-one/abac";
import { Badge, Button, ChoiceFormField, InputFormField } from "@visionarai-one/ui";
import { PlusIcon, Settings2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ComponentPropsWithoutRef } from "react";
import { type Control, type FieldArrayWithId, useFieldArray } from "react-hook-form";

export type AttributeInputProps = ComponentPropsWithoutRef<"div"> & {
	formControl: Control<MasterDataType>;
	resourceIndex: number;
};

type AttributesArrayPath = `resources.${number}.attributes`;

export const AttributeInput = ({ formControl, resourceIndex, ...props }: AttributeInputProps) => {
	const t = useTranslations("MasterData");
	const name = `resources.${resourceIndex}.attributes` as AttributesArrayPath;
	const { fields, append, remove } = useFieldArray<MasterDataType, AttributesArrayPath>({
		control: formControl,
		name,
	});

	return (
		<div className="space-y-4" data-testid="attribute-input" {...props}>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Settings2 className="size-4 text-muted-foreground" />
					<h4 className="font-medium text-sm">{t("attributes.heading")}</h4>
					{fields.length > 0 && (
						<Badge className="text-xs" variant="secondary">
							{fields.length}
						</Badge>
					)}
				</div>
				<Button aria-label={t("attributes.addAttribute")} className="h-8" onClick={() => append({ key: "", type: "string" })} size="sm" variant="outline">
					<PlusIcon className="mr-1 size-3.5" />
					Add
				</Button>
			</div>

			{fields.length === 0 ? (
				<div className="rounded-md border border-muted-foreground/25 border-dashed bg-muted/10 p-4 text-center">
					<Settings2 className="mx-auto mb-2 size-8 text-muted-foreground/50" />
					<p className="text-muted-foreground text-xs">{t("common.emptyHint")}</p>
				</div>
			) : (
				<div className="space-y-3">
					{fields.map((field: FieldArrayWithId<MasterDataType, AttributesArrayPath>, index) => (
						<div className="flex items-end gap-3 rounded-md border border-border/50 bg-muted/20 p-3" key={field.id}>
							<div className="flex-1">
								<InputFormField
									formControl={formControl}
									label={t("attributes.keyLabel")}
									name={`resources.${resourceIndex}.attributes.${index}.key`}
									placeholder={t("attributes.keyPlaceholder")}
								/>
							</div>
							<div className="flex-1">
								<ChoiceFormField
									assumeMoreOptions
									formControl={formControl}
									label={t("attributes.typeLabel")}
									name={`resources.${resourceIndex}.attributes.${index}.type`}
									options={ATTRIBUTE_TYPES.map((type) => ({
										label: type,
										value: type,
									}))}
								/>
							</div>
							<Button
								aria-label={t("attributes.removeAttribute")}
								className="h-10 w-10 text-muted-foreground hover:text-destructive"
								onClick={() => remove(index)}
								size="icon"
								type="button"
								variant="ghost"
							>
								<X className="size-3.5" />
							</Button>
						</div>
					))}
				</div>
			)}
		</div>
	);
};
