import { Button } from "@visionarai-one/ui";
import type { CSSProperties } from "react";

export type Placement = "bottom-right" | "bottom-left" | "top-right" | "top-left";

export type ToggleButtonProps = {
	placement: Placement;
	onClick: () => void;
	className?: string;
};

const placementToStyle: Record<Placement, CSSProperties> = {
	"bottom-left": { bottom: 24, left: 24 },
	"bottom-right": { bottom: 24, right: 24 },
	"top-left": { left: 24, top: 24 },
	"top-right": { right: 24, top: 24 },
};

export const ToggleButton = ({ placement, onClick, className }: ToggleButtonProps) => {
	return (
		<Button
			aria-label="Open Data Debugger"
			className={`fixed z-999 h-6 w-32 bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 font-medium text-white text-xs shadow-lg ring-1 ring-white/10 ring-inset transition-all ${className || ""}`}
			onClick={onClick}
			style={placementToStyle[placement]}
			type="button"
		>
			DevTools
		</Button>
	);
};
