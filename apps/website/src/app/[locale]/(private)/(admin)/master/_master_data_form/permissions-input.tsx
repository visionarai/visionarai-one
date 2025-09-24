"use client";

import type { MasterDataType } from "@visionarai-one/abac";
import { Badge, Button, Input } from "@visionarai-one/ui";
import { PlusIcon, Shield, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { type Control, Controller } from "react-hook-form";

export type PermissionsInputProps = {
	formControl: Control<MasterDataType>;
	resourceIndex: number;
};

type PermissionsArrayPath = `resources.${number}.permissions`;

export const PermissionsInput = ({ formControl, resourceIndex }: PermissionsInputProps) => {
	const t = useTranslations("MasterData");
	const name = `resources.${resourceIndex}.permissions` as PermissionsArrayPath;

	return (
		<Controller
			control={formControl}
			name={name}
			render={({ field }) => {
				const permissions = field.value || [];

				return (
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Shield className="size-4 text-muted-foreground" />
								<h4 className="font-medium text-sm">{t("permissions.heading")}</h4>
								{permissions.length > 0 && (
									<Badge className="text-xs" variant="secondary">
										{permissions.length}
									</Badge>
								)}
							</div>
							<Button
								aria-label={t("permissions.addPermission")}
								className="h-8"
								onClick={() => {
									const newPermissions = [...permissions, ""];
									field.onChange(newPermissions);
								}}
								size="sm"
								type="button"
								variant="outline"
							>
								<PlusIcon className="mr-1 size-3.5" />
								Add
							</Button>
						</div>

						{permissions.length === 0 ? (
							<div className="rounded-md border border-muted-foreground/25 border-dashed bg-muted/10 p-4 text-center">
								<Shield className="mx-auto mb-2 size-8 text-muted-foreground/50" />
								<p className="text-muted-foreground text-xs">{t("common.emptyHint")}</p>
							</div>
						) : (
							<div className="space-y-3">
								{permissions.map((permission, index) => (
									// eslint-disable-next-line react/no-array-index-key
									<div className="flex items-center gap-3 rounded-md border border-border/50 bg-muted/20 p-3" key={`${permission || "perm"}-${index}`}>
										<Input className="flex-1" placeholder="e.g. read, write, delete" {...formControl.register(`${name}.${index}` as PermissionsArrayPath)} />
										<Button
											aria-label={t("permissions.removePermission")}
											className="h-10 w-10 text-muted-foreground hover:text-destructive"
											onClick={() => {
												const newPermissions = [...permissions];
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
							</div>
						)}
					</div>
				);
			}}
		/>
	);
};
