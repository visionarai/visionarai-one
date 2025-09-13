"use client";

import type { MasterDataType } from "@visionarai-one/abac";
import { Button, Input } from "@visionarai-one/ui";
import { PlusIcon, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { type Control, Controller } from "react-hook-form";

export type PermissionsInputProps = {
	formControl: Control<MasterDataType>;
	resourceIndex: number;
};

type PermissionsArrayPath = `resources.${number}.permissions`;

export const PermissionsInput = ({ formControl, resourceIndex }: PermissionsInputProps) => {
	// NOTE: We keep the prop name (formControl) to avoid ripple changes; assumed to carry both control & register.

	const t = useTranslations("MasterData.permissions");

	const name = `resources.${resourceIndex}.permissions` as PermissionsArrayPath;

	return (
		<Controller
			control={formControl}
			name={name}
			render={({ field }) => {
				return (
					<div className="space-y-2">
						<div className="flex items-center gap-1">
							<h3 className="font-medium text-[11px] text-muted-foreground/80 uppercase tracking-wide">{t("heading")}</h3>
							<Button
								aria-label={t("addPermission")}
								className="h-6 w-6"
								onClick={() => {
									const newPermissions = [...(field.value || []), ""];
									field.onChange(newPermissions);
								}}
								size="icon"
								type="button"
								variant="ghost"
							>
								<PlusIcon className="size-3.5" />
							</Button>
						</div>
						{field.value?.map((permission, index) => (
							// eslint-disable-next-line react/no-array-index-key
							<div className="flex items-center gap-3 [&>:not(:last-child)]:flex-1" key={`${permission || "perm"}-${index}`}>
								<Input className="flex-1" {...formControl.register(`${name}.${index}` as PermissionsArrayPath)} />
								<Button
									aria-label={t("removePermission")}
									className="h-6 w-6 text-muted-foreground hover:text-destructive"
									onClick={() => {
										const newPermissions = [...(field.value || [])];
										newPermissions.splice(index, 1);
										field.onChange(newPermissions);
									}}
									size="icon"
									type="button"
									variant="ghost"
								>
									<X className="size-3.5" />
								</Button>
							</div>
						))}
						{(!field.value || field.value.length === 0) && <p className="text-muted-foreground text-xs">{t("emptyHint")}</p>}
					</div>
				);
			}}
		/>
	);
};
