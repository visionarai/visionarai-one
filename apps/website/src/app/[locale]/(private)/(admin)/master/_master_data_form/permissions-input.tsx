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

	const t = useTranslations("MasterData");

	const name = `resources.${resourceIndex}.permissions` as PermissionsArrayPath;

	return (
		<Controller
			control={formControl}
			name={name}
			render={({ field }) => {
				return (
					<div className="space-y-2">
						<Button
							aria-label={t("permissions.addPermission")}
							onClick={() => {
								const newPermissions = [...(field.value || []), ""];
								field.onChange(newPermissions);
							}}
							type="button"
							variant="secondary"
						>
							{t("permissions.heading")}
							<PlusIcon className="size-3.5" />
						</Button>

						{field.value?.map((permission, index) => (
							// eslint-disable-next-line react/no-array-index-key
							<div className="flex items-center gap-3 [&>:not(:last-child)]:flex-1" key={`${permission || "perm"}-${index}`}>
								<Input className="flex-1" {...formControl.register(`${name}.${index}` as PermissionsArrayPath)} />
								<Button
									aria-label={t("permissions.removePermission")}
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
						{(!field.value || field.value.length === 0) && <p className="text-muted-foreground text-xs">{t("common.emptyHint")}</p>}
					</div>
				);
			}}
		/>
	);
};
