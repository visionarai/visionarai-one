import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@visionarai-one/ui";
import { CheckCircle2 } from "lucide-react";
import { getTranslations } from "next-intl/server";

// Single source of truth for benefits configuration
const benefitsConfig: Array<{ id: string }> = [{ id: "experience" }, { id: "turnkey" }, { id: "speed" }];

export const WhyVisionSection = async () => {
	const t = await getTranslations("LandingPage.why");

	return (
		<section className="py-16 sm:py-24" id="why">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mb-12 text-center">
					<h2 className="mb-4 bg-gradient-to-r from-teal-400 to-lime-400 bg-clip-text font-bold text-3xl text-transparent sm:text-4xl">{t("title")}</h2>
				</div>

				<div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
					{benefitsConfig.map((benefit) => (
						<Card className="border-slate-700 bg-slate-900/50 backdrop-blur transition-colors hover:border-teal-500/50" key={benefit.id}>
							<CardHeader>
								<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-lime-500">
									<CheckCircle2 className="h-6 w-6 text-white" />
								</div>
								<CardTitle className="text-lg text-white">{t(`benefits.${benefit.id}.title`)}</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription className="text-slate-400">{t(`benefits.${benefit.id}.description`)}</CardDescription>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
};
