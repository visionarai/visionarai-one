"use client"; // Error boundaries must be Client Components

import { Button } from "@visionarai-one/ui";

export default function ErrorPage({ error }: { error: Error & { digest?: string } }) {
	return (
		<div>
			<h2 className="mb-4 font-bold text-2xl">Something went wrong!</h2>
			<p className="mb-4 text-muted-foreground text-sm">Please try refreshing the page. If the problem persists, contact support.</p>
			<Button onClick={() => window.location.reload()}>Reload Page</Button>
			{error?.digest && (
				<p className="mt-4 text-muted-foreground text-xs">
					Error ID: <code>{error.digest}</code>
				</p>
			)}
			{error?.message && (
				<p className="mt-2 text-muted-foreground text-xs">
					Message: <code>{error.message}</code>
				</p>
			)}
		</div>
	);
}
