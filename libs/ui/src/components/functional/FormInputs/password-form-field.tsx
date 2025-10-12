"use client";

import { FormControl, FormField, FormItem, FormLabel, InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@visionarai-one/ui";
import { cn } from "@visionarai-one/utils";
import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from "lucide-react";
import { useMemo, useState } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { useFormState, useWatch } from "react-hook-form";
export type PasswordFormFieldProps<T extends FieldValues> = React.ComponentProps<"input"> & {
	name: FieldPath<T>;
	label: string;
	formControl: Control<T>;
	passwordRequirements?: PasswordRequirementProps[];
	placeholder?: string;
	description?: string;
};
export type PasswordRequirementProps = {
	key: string;
	test: (value: string) => boolean;
	message: string;
};

export function PasswordFormField<T extends FieldValues>({
	name,
	label,
	formControl,
	placeholder,
	description,
	passwordRequirements,
	...props
}: PasswordFormFieldProps<T>) {
	const [type, setType] = useState<"password" | "text">("password");

	const watchedValue = useWatch({ control: formControl, name });
	const { touchedFields } = useFormState({ control: formControl });
	const metRequirements = useMemo(() => passwordRequirements?.map((req) => req.test(String(watchedValue ?? ""))) || [], [passwordRequirements, watchedValue]);

	const hasTyped = Boolean(watchedValue && String(watchedValue).length > 0);
	const nameKey = String(name);
	const touchedMap = touchedFields as unknown as Record<string, unknown> | undefined;
	const isTouched = Boolean(touchedMap?.[nameKey]);
	const showRequirements = hasTyped || isTouched;

	return (
		<FormField
			control={formControl}
			name={name}
			render={({ field }) => {
				return (
					<FormItem>
						<FormLabel>{label}</FormLabel>
						<FormControl>
							<InputGroup>
								<InputGroupAddon align="top-right">
									<InputGroupButton
										aria-label={type === "password" ? "Show password" : "Hide password"}
										aria-pressed={type === "text"}
										onClick={(e) => {
											e.preventDefault();
											setType(type === "password" ? "text" : "password");
										}}
										size="icon-sm"
										tabIndex={-1}
										type="button"
										variant="link"
									>
										{type === "password" ? <EyeOffIcon /> : <EyeIcon />}
									</InputGroupButton>
								</InputGroupAddon>
								<InputGroupInput
									autoCapitalize="none"
									autoComplete="current-password"
									autoCorrect="off"
									placeholder={placeholder}
									spellCheck="false"
									type={type}
									{...field}
									{...props}
								/>

								{/* Announce requirement status changes to assistive tech. Only show after user interacts. */}
								{showRequirements && (
									<InputGroupAddon align="block-end" aria-atomic="true" aria-live="polite" className="flex flex-col items-start gap-1 pt-4">
										{passwordRequirements?.map((req, idx) => (
											<span className={cn("mr-2 inline-block", metRequirements[idx] ? "text-green-600" : "text-destructive")} key={req.key}>
												{metRequirements[idx] ? <CheckIcon className="inline" /> : <XIcon className="inline" />} {req.message}
											</span>
										))}
									</InputGroupAddon>
								)}
							</InputGroup>
						</FormControl>
					</FormItem>
				);
			}}
		/>
	);
}
