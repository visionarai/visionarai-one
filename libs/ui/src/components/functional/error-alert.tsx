"use client";

import { Alert, AlertDescription } from "@visionarai-one/ui";
import { AlertTriangle } from "lucide-react";

type ErrorAlertProps = {
	description: string;
	details?: string;
};

export const ErrorAlert = ({ description, details }: ErrorAlertProps) => (
	<Alert className="border-destructive/40 bg-destructive/5" variant="destructive">
		<AlertTriangle className="h-4 w-4" />
		<AlertDescription>
			{description}
			{details ? <span className="mt-1 block text-xs opacity-70">{details}</span> : null}
		</AlertDescription>
	</Alert>
);
