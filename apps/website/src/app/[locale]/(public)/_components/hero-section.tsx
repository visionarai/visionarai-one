import { Button, VisionaraiLogo } from "@visionarai-one/ui";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export const HeroSection = async () => {
	const t = await getTranslations("LandingPage.hero");

	return (
		<section className="relative flex min-h-[85vh] items-center justify-center py-16 sm:py-24" id="hero">
			<div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-5xl text-center">
					{/* Logo with better spacing */}
					<div className="mb-8 flex justify-center">
						<VisionaraiLogo size={56} />
					</div>

					<h1 className="mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text font-bold text-4xl text-transparent leading-tight sm:text-5xl lg:text-6xl xl:text-7xl">
						{t("headline")}
					</h1>

					<p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground leading-relaxed sm:text-xl lg:text-2xl">{t("subheadline")}</p>

					<div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
						<Button asChild className="min-w-[200px]" size="lg">
							<Link href="#tools">{t("primaryCta")}</Link>
						</Button>
						<Button asChild className="min-w-[200px]" size="lg" variant="outline">
							<Link href="#tools">{t("secondaryCta")}</Link>
						</Button>
					</div>
				</div>
			</div>

			{/* Subtle background decoration */}
			<div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
		</section>
	);
};
