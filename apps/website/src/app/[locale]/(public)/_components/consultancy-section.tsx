import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@visionarai-one/ui";
import { getTranslations } from "next-intl/server";

export const ConsultancySection = async () => {
	const t = await getTranslations("LandingPage.consultancy");

	return (
		<section className="py-16 sm:py-24" id="consultancy">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<Card className="border-primary/20 bg-card/50 backdrop-blur">
					<CardHeader className="text-center">
						<CardTitle className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-3xl text-transparent sm:text-4xl">{t("title")}</CardTitle>
					</CardHeader>
					<CardContent>
						<CardDescription className="mx-auto max-w-2xl text-center text-lg text-muted-foreground leading-relaxed">{t("description")}</CardDescription>
					</CardContent>
				</Card>
			</div>
		</section>
	);
};
