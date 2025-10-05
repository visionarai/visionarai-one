"use client";

import { Button } from "@visionarai-one/ui";
import { HomeIcon, MoveLeftIcon } from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";

export default function NotFound() {
	const goBack = useCallback(() => {
		// Use history.back() to allow the user to return to the previous page if available
		if (typeof window !== "undefined") window.history.back();
	}, []);

	return (
		<html lang="en">
			<body className="min-h-screen bg-white text-slate-900 dark:bg-black dark:text-slate-100">
				<main className="flex items-center justify-center px-4 py-20">
					<div className="max-w-md text-center">
						<p className="font-medium text-lg text-rose-600">404</p>
						<h1 className="mt-4 font-bold text-3xl tracking-tight">Page not found</h1>
						<p className="mt-2 text-slate-600 text-sm dark:text-slate-400">We couldn’t find the page you’re looking for.</p>

						<div className="mt-6 flex items-center justify-center gap-3">
							<Button asChild>
								<Link aria-label="Go to home page" href="/">
									<HomeIcon />
									Go home
								</Link>
							</Button>
							<Button aria-label="Go back to previous page" onClick={goBack} variant="outline">
								<MoveLeftIcon />
								Go back
							</Button>
						</div>
					</div>
				</main>
			</body>
		</html>
	);
}
