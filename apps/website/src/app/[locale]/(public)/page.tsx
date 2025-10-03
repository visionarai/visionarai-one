import { Footer } from "@visionarai-one/ui";
import { ConsultancySection, CtaSection, CustomDevSection, HeroSection, ToolsSection, WhyVisionSection } from "./_components";

export default function LandingPage() {
	return (
		<div className="min-h-screen">
			<HeroSection />
			<ConsultancySection />
			<ToolsSection />
			<CustomDevSection />
			<WhyVisionSection />
			<CtaSection />
			<Footer />
		</div>
	);
}
