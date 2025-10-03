import { cn } from "@visionarai-one/utils";
import { TheyEyeOfVision } from "./the-eye-of-vision";

type VisionLogoProps = {
	size?: number;
	className?: string;
};
export const VisionaraiLogo = ({ size = 32, className = "" }: VisionLogoProps) => (
	<div>
		<span className={cn("inline-flex items-center", className)} style={{ fontSize: size }}>
			vision
			<TheyEyeOfVision className="mx-1 inline-block" size={size * 0.95} />
			ar.ai
		</span>
	</div>
);
