import type { ReactNode } from "react";
import { Spinner } from "./spinner";

export function LoadingSwap({
	isLoading,
	children,
	className,
	loaderSize = 32,
}: {
	isLoading: boolean;
	children: ReactNode;
	className?: string;
	loaderSize?: number;
}) {
	return <div className={className}>{isLoading ? <Spinner size={loaderSize} /> : children}</div>;
}
