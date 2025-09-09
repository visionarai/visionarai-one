"use client";

import NextError from "next/error";

export default function NotFound() {
	return (
		<html lang="en">
			<body>
				<h1 className="mt-20 text-center font-bold text-4xl">Page Not Found</h1>
				<NextError statusCode={404} />
			</body>
		</html>
	);
}
