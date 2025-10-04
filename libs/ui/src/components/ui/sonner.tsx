"use client";

import { Check, CircleOff, Info, LoaderCircle, TriangleAlert } from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = "system" } = useTheme();

	return (
		<Sonner
			className="toaster group"
			icons={{
				error: <CircleOff />,
				info: <Info />,
				loading: <LoaderCircle className="animate-spin" />,
				success: <Check />,
				warning: <TriangleAlert />,
			}}
			position="top-right"
			richColors
			style={
				{
					"--normal-bg": "var(--popover)",
					"--normal-border": "var(--border)",
					"--normal-text": "var(--popover-foreground)",
				} as React.CSSProperties
			}
			theme={theme as ToasterProps["theme"]}
			{...props}
		/>
	);
};

export { Toaster };
