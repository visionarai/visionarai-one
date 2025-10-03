import { Button, VisionaraiLogo } from "@visionarai-one/ui";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export const HeroSection = async () => {
	const t = await getTranslations("LandingPage.hero");

	return (
		<section className="relative py-20 sm:py-32 lg:py-40" id="hero">
			<div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-4xl text-center">
					<VisionaraiLogo size={100} />
					<h1 className="my-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text font-bold text-5xl text-transparent sm:text-6xl lg:text-7xl">
						{t("headline")}
					</h1>
					<p className="mx-auto mb-8 max-w-3xl text-muted-foreground text-xl leading-relaxed sm:text-2xl">{t("subheadline")}</p>

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
