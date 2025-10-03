import { Footer, VisionaraiLogo } from "@visionarai-one/ui";
import { getTranslations } from "next-intl/server";

const HeroSection = async () => {
	const t = await getTranslations("LandingPage.hero");

	return (
		<section>
			<div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-4xl text-center">
					<h1 className="mb-6 bg-gradient-to-r from-white via-teal-100 to-lime-100 bg-clip-text font-bold text-5xl text-transparent sm:text-6xl lg:text-7xl">
						{t("headline")}
					</h1>
					<p className="mx-auto mb-8 max-w-3xl text-slate-300 text-xl leading-relaxed sm:text-2xl">{t("subheadline")}</p>
					<VisionaraiLogo size={100} />
				</div>
			</div>
		</section>
	);
};

export default function LandingPage() {
	return (
		<div className="min-h-screen">
			<HeroSection />

			<Footer />
		</div>
	);
}
