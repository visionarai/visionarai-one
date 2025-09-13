"use client";

import { ATTRIBUTE_TYPES, type MasterDataType } from "@visionarai-one/abac";
import { Button, Input, Label } from "@visionarai-one/ui";
import { PlusIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ComponentPropsWithoutRef } from "react";
import { type Control, type FieldArrayWithId, type UseFormRegister, useFieldArray } from "react-hook-form";

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
	// Extract register (Control type doesn't include it). We trust caller passes an object containing register.
	const register: UseFormRegister<MasterDataType> = (formControl as unknown as { register: UseFormRegister<MasterDataType> }).register;

	return (
		<div className="space-y-3" data-testid="attribute-input" {...props}>
			<div className="flex items-center justify-between">
				<h4 className="font-medium text-sm">{t("heading")}</h4>
				<Button onClick={() => append({ key: "", type: "string" })} size="sm" type="button" variant="outline">
					<PlusIcon className="mr-1 size-4" /> {t("addAttribute")}
				</Button>
			</div>
			<div className="space-y-2">
				{fields.length === 0 && (
					<p className="text-muted-foreground text-xs" data-testid="attribute-empty-hint">
						{t("emptyHint")}
					</p>
				)}
				{fields.map((field: FieldArrayWithId<MasterDataType, AttributesArrayPath>, index) => (
					<div className="group relative flex gap-3 rounded-md border bg-muted/40 p-3 transition-colors hover:bg-muted" key={field.id}>
						<div className="flex flex-1 flex-col gap-1">
							<Label className="sr-only" htmlFor={`attr-key-${field.id}`}>
								{t("keyLabel")}
							</Label>
							<Input
								id={`attr-key-${field.id}`}
								placeholder={t("keyPlaceholder")}
								{...register(`resources.${resourceIndex}.attributes.${index}.key` as const)}
							/>
						</div>
						<div className="flex w-40 flex-col gap-1">
							<Label className="sr-only" htmlFor={`attr-type-${field.id}`}>
								{t("typeLabel")}
							</Label>
							<select
								className="h-9 w-full rounded-md border bg-background px-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
								id={`attr-type-${field.id}`}
								{...register(`resources.${resourceIndex}.attributes.${index}.type` as const)}
							>
								{ATTRIBUTE_TYPES.map((opt) => (
									<option key={opt} value={opt}>
										{opt}
									</option>
								))}
							</select>
						</div>
						<Button
							aria-label={t("removeAttribute")}
							className="text-destructive hover:text-destructive"
							onClick={() => remove(index)}
							size="icon"
							type="button"
							variant="ghost"
						>
							<XIcon className="size-4" />
						</Button>
					</div>
				))}
			</div>
		</div>
	);
};
