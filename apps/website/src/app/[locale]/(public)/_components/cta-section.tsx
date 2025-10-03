import { Button, Card, CardContent } from "@visionarai-one/ui";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export const CtaSection = async () => {
	const t = await getTranslations("LandingPage.cta");

	return (
		<section className="py-16 sm:py-24" id="cta">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<Card className="border-teal-500/20 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur">
					<CardContent className="px-6 py-12 text-center sm:px-12">
						<h2 className="mb-8 bg-gradient-to-r from-teal-400 to-lime-400 bg-clip-text font-bold text-3xl text-transparent sm:text-4xl lg:text-5xl">
							{t("title")}
						</h2>
						<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
							<Button asChild className="w-full bg-gradient-to-r from-teal-500 to-lime-500 sm:w-auto" size="lg">
								<Link href="#contact">{t("primaryCta")}</Link>
							</Button>
							<Button asChild className="w-full border-teal-500 sm:w-auto" size="lg" variant="outline">
								<Link href="#tools">{t("secondaryCta")}</Link>
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</section>
	);
};
