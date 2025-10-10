import { type ReactNode, Suspense } from "react";
import { Spinner } from "../ui/spinner";

export function SuspenseSwap({ children, loaderSize = 28 }: { children: ReactNode; loaderSize?: number }) {
	return <Suspense fallback={<Spinner size={loaderSize} />}>{children}</Suspense>;
}
