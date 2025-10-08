import type { ReactNode } from "react";
import { Spinner } from "./spinner";

export function LoadingSwap({
	isLoading,
	children,
	loaderSize = 28,
}: {
	isLoading: boolean;
	children: ReactNode;
	loaderSize?: number;
}) {
		
	
	if (isLoading) {
		return <Spinner size={loaderSize} />;
	}
	return <>{children}</>;
}
