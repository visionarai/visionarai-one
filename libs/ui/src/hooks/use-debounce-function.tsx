"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Debounces a function and returns a debounced version plus the last result.
 * The returned function uses the same parameter list as the original function.
 */
export function useDebounceFunction<T extends unknown[], R>(func: (...args: T) => R, wait: number) {
	const [args, setArgsState] = useState<T | undefined>(undefined);
	const [result, setResult] = useState<R | null>(null);

	const setArgs = useCallback((...newArgs: T) => {
		setArgsState(newArgs);
	}, []);

	useEffect(() => {
		if (args !== undefined) {
			const handler = setTimeout(() => {
				const res = func(...(args as T));
				setResult(res as R);
			}, wait);

			return () => {
				clearTimeout(handler);
			};
		}
		return;
	}, [args, func, wait]);

	return [setArgs, result] as const;
}
