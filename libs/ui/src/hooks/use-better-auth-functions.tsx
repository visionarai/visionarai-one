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
	loadingMessage?: ToastDisplayable;
	successMessage?: string;
	errorMessage?: string;
};
export function useBetterAuthFunction<Args extends unknown[], Return extends { error: null | { message?: string } }>(
	asyncFunction: (...args: Args) => Promise<Return>,
	options: AsyncFunctionOptions<Return>
) {
	const [isLoading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const execute = async (...args: Args) => {
		setLoading(true);
		setError(null);
		const toastID = toast.loading(options.loadingMessage || "Processing...");

		try {
			const result = await asyncFunction(...args);
			if (result.error) {
				toast.error(result.error.message || "Error");
				options.onError?.(new Error(options.errorMessage || result.error.message));
				return result;
			}

			toast.success(options.successMessage || "Success");

			options.onSuccess?.(result);

			return result;
		} catch (err) {
			if (!(err instanceof Error)) {
				const e = new Error(options.errorMessage || "An unknown error occurred");
				setError(e);
				options.onError?.(e);
				toast.error(e.message);
			}
			const e = err as Error;
			setError(e);
			options.onError?.(e);
			toast.error(options.errorMessage || e.message || "Error");
			return null;
		} finally {
			setLoading(false);
			toast.dismiss(toastID);
		}
	};

	return [execute, { error, isLoading }] as const;
}
