import { Button, VisionaraiLogo } from "@visionarai-one/ui";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export const HeroSection = async () => {
	const t = await getTranslations("LandingPage.hero");

	return (
		<section className="relative py-20 sm:py-32 lg:py-40" id="hero">
			<div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-4xl text-center">
					<h1 className="mb-6 bg-gradient-to-r from-white via-teal-100 to-lime-100 bg-clip-text font-bold text-5xl text-transparent sm:text-6xl lg:text-7xl">
						{t("headline")}
					</h1>
					<p className="mx-auto mb-8 max-w-3xl text-slate-300 text-xl leading-relaxed sm:text-2xl">{t("subheadline")}</p>

					<div className="mb-12 flex justify-center">
						<VisionaraiLogo size={100} />
					</div>

					<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
						<Button asChild className="w-full sm:w-auto" size="lg">
							<Link href="#tools">{t("primaryCta")}</Link>
						</Button>
						<Button asChild className="w-full sm:w-auto" size="lg" variant="outline">
							<Link href="#tools">{t("secondaryCta")}</Link>
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
};
