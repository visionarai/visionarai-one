"use client";

import { type ReactNode, useState } from "react";
import { toast } from "sonner";

// Simplified shape acceptable to toast.promise (no object compound message to keep typing simple)
type ToastDisplayable = string | ReactNode;

type AsyncFunctionOptions<Return> = {
	/** Called after a successful resolution (before toast success message is returned) */
	onSuccess?: (data: Return) => void;
	/** Called when the promise rejects */
	onError?: (error: Error) => void;
	/**
	 * Message (string / react node / object) or factory for success state.
	 * If omitted a generic "Success" message is shown.
	 */
	successMessage?: ToastDisplayable | ((data: Return) => ToastDisplayable);
	/**
	 * Message (string / react node / object) or factory for error state.
	 * If omitted the error.message (or generic "Error") is shown.
	 */
	errorMessage?: ToastDisplayable | ((error: Error) => ToastDisplayable);
	/** Loading placeholder while the async function runs (defaults to "Loading...") */
	loadingMessage?: ToastDisplayable;
	/** Disable toast usage (falls back to legacy silent mode) */
	disableToast?: boolean;
};

/**
 * Wrap an async function with local loading/error state and simple toast lifecycle notifications.
 * Returns a stable wrapper you can call with the original arguments.
 */
export function useAsyncFunction<Args extends unknown[], Return>(asyncFunction: (...args: Args) => Promise<Return>, options?: AsyncFunctionOptions<Return>) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const formatSuccess = (data: Return): ToastDisplayable => {
		const msg = options?.successMessage;
		if (typeof msg === "function") {
			return msg(data);
		}
		return msg ?? "Success";
	};

	const formatError = (err: Error): ToastDisplayable => {
		const msg = options?.errorMessage;
		if (typeof msg === "function") {
			return msg(err);
		}
		return msg ?? err.message ?? "Error";
	};

	// Helpers to keep execute() simple and low-complexity
	const shouldToast = !options?.disableToast;
	const showLoading = (): string | number | undefined => (shouldToast ? toast.loading(options?.loadingMessage ?? "Loading...") : undefined);
	const showSuccess = (data: Return) => {
		if (shouldToast) toast.success(formatSuccess(data));
	};
	const showError = (err: Error) => {
		if (shouldToast) toast.error(formatError(err));
	};
	const dismiss = (id?: string | number) => {
		if (id !== undefined) toast.dismiss(id);
	};
	const normalizeError = (err: unknown): Error => (err instanceof Error ? err : new Error("An unknown error occurred"));

	const execute = async (...args: Args): Promise<Return> => {
		setLoading(true);
		setError(null);

		const toastId = showLoading();

		try {
			const result = await asyncFunction(...args);
			options?.onSuccess?.(result);
			showSuccess(result);
			return result;
		} catch (err) {
			const e = normalizeError(err);
			setError(e);
			options?.onError?.(e);
			showError(e);
			throw e;
		} finally {
			setLoading(false);
			dismiss(toastId);
		}
	};

	return [execute, { error, loading }] as const;
}
