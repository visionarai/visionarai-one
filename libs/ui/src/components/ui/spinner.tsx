import { type FC } from "react";
import { cn } from "@visionarai-one/utils";

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
        width: outerSize,
        height: outerSize,
        borderWidth: `${border}px`,
        boxSizing: "border-box",
    };

    const innerStyle: React.CSSProperties = {
        width: innerSize,
        height: innerSize,
        borderWidth: `${innerBorder}px`,
        boxSizing: "border-box",
    };

    return (
        <div className={cn("flex flex-col items-center gap-4 p-6", className)}>
            <div className="flex w-full flex-col items-center justify-center gap-4">
                {/* outer spinner — role=status for screen readers, aria-label override allowed */}
                <div
                    role="status"
                    aria-label={ariaLabel}
                    className={cn(
                        "flex items-center justify-center rounded-full border-transparent border-t-primary animate-spin",
                    )}
                    style={outerStyle}
                >
                    {/* inner spinner — purely decorative */}
                    <div
                        aria-hidden
                        className={cn(
                            "flex items-center justify-center rounded-full border-transparent border-t-secondary animate-spin",
                        )}
                        style={innerStyle}
                    />
                    {/* Visually hidden text for extra screen reader compatibility */}
                    <span className="sr-only">{ariaLabel}</span>
                </div>
            </div>
        </div>
    );
};
