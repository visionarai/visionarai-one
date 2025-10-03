import { cn } from "@visionarai-one/utils";
import { TheyEyeOfVision } from "./the-eye-of-vision";

type VisionLogoProps = {
	size?: number;
	className?: string;
	followCursor?: boolean;
};
export const VisionaraiLogo = ({ size = 32, className = "", followCursor = true }: VisionLogoProps) => (
	<div>
		<span className={cn("inline-flex items-center font-bold text-foreground", className)} style={{ fontSize: size }}>
			vision
			<TheyEyeOfVision className="mx-1 inline-block" followCursor={followCursor} size={size * 0.95} />
			ar.ai
		</span>
	</div>
);
