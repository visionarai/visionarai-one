"use client";

import { cn } from "@visionarai-one/utils";
import { AlertCircleIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { FieldError, FieldErrors, UseFormReturn } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "../ui";

/**
 * Recursively flattens react-hook-form FieldErrors into a list of
 * path/message pairs so they can be rendered in a concise, user‑friendly list.
 */
type FlattenedError = {
	path: string;
	message: string;
};

const isFieldError = (val: unknown): val is FieldError => !!val && typeof val === "object" && "message" in (val as Record<string, unknown>);

const joinPath = (parent: string, segment: string | number) => (parent ? `${parent}.${segment}` : String(segment));

// --- Error Flattening Helpers (kept small for low cyclomatic complexity) ---
const pushFieldErrorMessages = (basePath: string, fe: FieldError & { types?: Record<string, unknown> }, acc: FlattenedError[]) => {
	const pushUnique = (msg: unknown) => {
		if (typeof msg !== "string") {
			return;
		}
		if (!acc.find((e) => e.path === basePath && e.message === msg)) {
			acc.push({ message: msg, path: basePath });
		}
	};
	if (fe.message) {
		pushUnique(fe.message);
	}
	if (fe.types) {
		for (const raw of Object.values(fe.types)) {
			if (Array.isArray(raw)) {
				raw.forEach(pushUnique);
			} else {
				pushUnique(raw);
			}
		}
	}
};

const processValue = (key: string, value: unknown, parentPath: string, acc: FlattenedError[]) => {
	if (!value) {
		return;
	}
	if (isFieldError(value)) {
		const basePath = joinPath(parentPath, key);
		pushFieldErrorMessages(basePath, value as FieldError & { types?: Record<string, unknown> }, acc);
		return;
	}
	if (Array.isArray(value)) {
		for (let i = 0; i < value.length; i++) {
			const v = value[i];
			if (v && typeof v === "object") {
				acc.push(...flattenErrors(v as FieldErrors<Record<string, unknown>>, joinPath(parentPath, `${key}[${i}]`)));
			}
		}
		return;
	}
	if (typeof value === "object") {
		acc.push(...flattenErrors(value as FieldErrors<Record<string, unknown>>, joinPath(parentPath, key)));
	}
};

const flattenErrors = (errors: FieldErrors<Record<string, unknown>>, parentPath = ""): FlattenedError[] => {
	if (!errors) {
		return [];
	}
	const acc: FlattenedError[] = [];
	for (const key of Object.keys(errors)) {
		processValue(key, (errors as Record<string, unknown>)[key], parentPath, acc);
	}
	return acc;
};

const humanize = (path: string) =>
	path
		.replace(/\[(\d+)\]/g, ".$1") // turn arr[index] into .index
		.split(".")
		.map((segment) => segment.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase())
		.join(" > ");

export type FormErrorSummaryProps = {
	/** Optional explicit errors object; if omitted the component uses form context. */
	errors?: FieldErrors<Record<string, unknown>>;
	/** Optional form instance (when not using FormProvider). */
	form?: UseFormReturn<Record<string, unknown>>;
	/** Custom title displayed above list. */
	title?: ReactNode;
	/** Limit number of list items shown (remaining count summarized). */
	maxItems?: number;
	/** Show a small count summary when errors exceed maxItems. */
	showOverflowCount?: boolean;
	/** Render each path segment – override to customize casing. */
	renderPathSegment?: (segment: string) => ReactNode;
	/** When true, display path as segmented “pills”; otherwise show a simple joined path. */
	showPathPills?: boolean;
	/** Additional className applied to the root Alert. */
	className?: string;
};

/**
 * FormErrorSummary
 *
 * Usage: Place inside a form wrapped by RHF's FormProvider (our <Form /> wrapper)
 * to automatically display a concise list of current validation errors.
 *
 * <FormErrorSummary /> will return null when there are no errors.
 */
export const FormErrorSummary = ({
	errors: externalErrors,
	form,
	title = "There were problems with your submission",
	maxItems = 6,
	showOverflowCount = true,
	className,
}: FormErrorSummaryProps) => {
	// Prefer explicit props then provided form then context
	const ctx = useFormContext();
	const activeForm = form ?? ctx;
	const errs = externalErrors ?? activeForm?.formState?.errors;
	const flattened = flattenErrors(errs as FieldErrors<Record<string, unknown>>);

	if (!flattened.length) {
		return null;
	}
	const shown = flattened.slice(0, maxItems);
	const remaining = flattened.length - shown.length;

	return (
		<Alert className={cn("space-y-2", className)} role="alert" variant="destructive">
			<AlertCircleIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
			<div className="w-full flex-1 space-y-1">
				{title && <AlertTitle className="font-medium text-sm">{title}</AlertTitle>}
				<AlertDescription>
					<ul className="space-y-2">
						{shown.map((e, i) => (
							<li className="text-xs leading-snug" key={`${e.path}-${i}`}>
								<div className="flex flex-col gap-0.5">
									<span className="font-bold">{humanize(e.path)}</span>
									<span className="text-muted-foreground">{e.message}</span>
								</div>
							</li>
						))}
					</ul>
					{showOverflowCount && remaining > 0 && (
						<p className="mt-2 text-muted-foreground text-xs">
							+ {remaining} more {remaining === 1 ? "error" : "errors"}
						</p>
					)}
				</AlertDescription>
			</div>
		</Alert>
	);
};

export default FormErrorSummary;
