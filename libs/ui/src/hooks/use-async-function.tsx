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
 * Wrap an async function with local loading/error state and toast.promise lifecycle notifications.
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

	const invoke = async (promise: Promise<Return>) => {
		try {
			const result = await promise;
			options?.onSuccess?.(result);
			return result;
		} catch (err) {
			const e = err as Error;
			setError(e);
			options?.onError?.(e);
			throw e; // rethrow so toast.promise can handle if active
		}
	};

	const execute = async (...args: Args): Promise<Return> => {
		setLoading(true);
		setError(null);
		const basePromise = invoke(asyncFunction(...args));

		if (options?.disableToast) {
			try {
				return await basePromise;
			} finally {
				setLoading(false);
			}
		}

		toast.promise(basePromise, {
			error: (err) => formatError(err as Error),
			loading: options?.loadingMessage ?? "Loading...",
			success: (data) => formatSuccess(data as Return),
		});

		try {
			return await basePromise;
		} finally {
			setLoading(false);
		}
	};

	return { error, execute, loading };
}
