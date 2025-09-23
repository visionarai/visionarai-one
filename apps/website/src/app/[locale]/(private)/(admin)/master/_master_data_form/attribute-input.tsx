"use client";

import { ATTRIBUTE_TYPES, type MasterDataType } from "@visionarai-one/abac";
import { Button, ChoiceFormField, InputFormField } from "@visionarai-one/ui";
import { PlusIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ComponentPropsWithoutRef } from "react";
import { type Control, type FieldArrayWithId, useFieldArray } from "react-hook-form";

export type AttributeInputProps = ComponentPropsWithoutRef<"div"> & {
	formControl: Control<MasterDataType>;
	resourceIndex: number;
};

type AttributesArrayPath = `resources.${number}.attributes`;

export const AttributeInput = ({ formControl, resourceIndex, ...props }: AttributeInputProps) => {
	// NOTE: We keep the prop name (formControl) to avoid ripple changes; assumed to carry both control & register.
	const t = useTranslations("MasterData.attributes");
	const name = `resources.${resourceIndex}.attributes` as AttributesArrayPath;
	const { fields, append, remove } = useFieldArray<MasterDataType, AttributesArrayPath>({
		control: formControl,
		name,
	});

	return (
		<div className="space-y-3" data-testid="attribute-input" {...props}>
			<Button aria-label={t("addAttribute")} onClick={() => append({ key: "", type: "string" })} variant="secondary">
				{t("heading")}
				<PlusIcon className="size-3.5" />
			</Button>

			<div className="space-y-2">
				{fields.length === 0 && (
					<p className="text-muted-foreground text-xs" data-testid="attribute-empty-hint">
						{t("emptyHint")}
					</p>
				)}
				{fields.map((field: FieldArrayWithId<MasterDataType, AttributesArrayPath>, index) => (
					<div className="flex items-center gap-3 [&>:not(:last-child)]:flex-1" key={field.id}>
						<InputFormField
							formControl={formControl}
							label={t("keyLabel")}
							name={`resources.${resourceIndex}.attributes.${index}.key`}
							placeholder={t("keyPlaceholder")}
						/>
						<ChoiceFormField
							assumeMoreOptions
							formControl={formControl}
							label={t("typeLabel")}
							name={`resources.${resourceIndex}.attributes.${index}.type`}
							options={ATTRIBUTE_TYPES.map((type) => ({
								label: type,
								value: type,
							}))}
						/>
						<Button
							aria-label={t("removeAttribute")}
							className="h-6 w-6 text-muted-foreground hover:text-destructive"
							onClick={() => remove(index)}
							size="icon"
							type="button"
							variant="ghost"
						>
							<XIcon className="size-3.5" />
						</Button>
					</div>
				))}
			</div>
		</div>
	);
};
