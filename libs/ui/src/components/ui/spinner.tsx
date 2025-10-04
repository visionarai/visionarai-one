import { cn } from "@visionarai-one/utils";
import type { FC } from "react";

type SpinnerProps = {
	/** Size in pixels for the outer spinner. Defaults to 80 (h-20/w-20). */
	size?: number;
	/** Additional className passthrough */
	className?: string;
	/** Accessible label override (default: "Loading") */
	"aria-label"?: string;
};

export const Spinner: FC<SpinnerProps> = ({ size = 80, className, "aria-label": ariaLabel = "Loading" }) => {
	// Normalize and guard the provided size
	const outerSize = Math.max(8, Math.round(Number(size) || 80));
	// Inner circle is 80% of outer by default (h-16 is 64 when outer is 80)
	const innerSize = Math.max(6, Math.round(outerSize * 0.8));
	// Border thickness chosen proportionally (approx 5% of size), but at least 1px
	const border = Math.max(1, Math.round(outerSize * 0.05));
	const innerBorder = Math.max(1, Math.round(border * 0.9));

	const outerStyle: React.CSSProperties = {
		borderWidth: `${border}px`,
		boxSizing: "border-box",
		height: outerSize,
		width: outerSize,
	};

	const innerStyle: React.CSSProperties = {
		borderWidth: `${innerBorder}px`,
		boxSizing: "border-box",
		height: innerSize,
		width: innerSize,
	};

	return (
		<div className={cn("flex flex-col items-center gap-4 p-6", className)}>
			<div className="flex w-full flex-col items-center justify-center gap-4">
				{/* outer spinner — role=status for screen readers, aria-label override allowed */}
				<div
					aria-label={ariaLabel}
					className={cn("flex animate-spin items-center justify-center rounded-full border-transparent border-t-primary")}
					role="status"
					style={outerStyle}
				>
					{/* inner spinner — purely decorative */}
					<div
						aria-hidden
						className={cn("flex animate-spin items-center justify-center rounded-full border-transparent border-t-secondary")}
						style={innerStyle}
					/>
					{/* Visually hidden text for extra screen reader compatibility */}
					<span className="sr-only">{ariaLabel}</span>
				</div>
			</div>
		</div>
	);
};
