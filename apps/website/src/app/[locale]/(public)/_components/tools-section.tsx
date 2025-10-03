"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@visionarai-one/ui";
import { Lightbulb, Rocket, Search, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";

const iconMap = {
	chart: TrendingUp,
	lightbulb: Lightbulb,
	rocket: Rocket,
	search: Search,
} as const;

// Single source of truth for tools configuration
const toolsConfig: Array<{
	id: string;
	icon: keyof typeof iconMap;
}> = [
	{ icon: "lightbulb", id: "validate-ideas" },
	{ icon: "search", id: "conduct-research" },
	{ icon: "rocket", id: "prototype" },
	{ icon: "chart", id: "market" },
];

export const ToolsSection = () => {
	const t = useTranslations("LandingPage.tools");

	return (
		<section className="py-16 sm:py-24" id="tools">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mb-12 text-center">
					<h2 className="mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text font-bold text-3xl text-transparent sm:text-4xl">{t("title")}</h2>
					<p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">{t("description")}</p>
				</div>

				<Carousel
					className="mx-auto w-full max-w-5xl"
					opts={{
						align: "start",
						loop: true,
					}}
				>
					<CarouselContent>
						{toolsConfig.map((tool) => {
							const Icon = iconMap[tool.icon];
							return (
								<CarouselItem className="md:basis-1/2 lg:basis-1/3" key={tool.id}>
									<Card className="h-full border-border bg-card backdrop-blur transition-colors hover:border-primary/50">
										<CardHeader>
											<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60">
												<Icon className="h-6 w-6 text-primary-foreground" />
											</div>
											<CardTitle className="text-card-foreground text-xl">{t(`items.${tool.id}.title`)}</CardTitle>
										</CardHeader>
										<CardContent>
											<CardDescription className="text-muted-foreground">{t(`items.${tool.id}.description`)}</CardDescription>
										</CardContent>
									</Card>
								</CarouselItem>
							);
						})}
					</CarouselContent>
					<CarouselPrevious className="hidden sm:flex" />
					<CarouselNext className="hidden sm:flex" />
				</Carousel>
			</div>
		</section>
	);
};
