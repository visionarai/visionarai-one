import { Spinner } from "@visionarai-one/ui";

export default function LoadingPage() {
	return (
		<main className="flex min-h-screen items-center justify-center bg-background">
			<Spinner />
		</main>
	);
}
