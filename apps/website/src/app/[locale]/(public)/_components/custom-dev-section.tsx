"use client";

import {
	Badge,
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
import { useTranslations } from "next-intl";

// Single source of truth for projects configuration
const projectsConfig: Array<{
	id: string;
	tech: string[];
}> = [
	{ id: "saas-platform", tech: ["Next.js", "TypeScript", "AI/ML"] },
	{ id: "automation", tech: ["Python", "AI Agents", "APIs"] },
	{ id: "chatbot", tech: ["NLP", "LLMs", "RAG"] },
];

export const CustomDevSection = () => {
	const t = useTranslations("LandingPage.customDev");

	return (
		<section className="py-16 sm:py-24" id="custom-dev">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mb-12 text-center">
					<h2 className="mb-4 bg-gradient-to-r from-teal-400 to-lime-400 bg-clip-text font-bold text-3xl text-transparent sm:text-4xl">{t("title")}</h2>
					<p className="mx-auto max-w-2xl text-lg text-slate-300 leading-relaxed">{t("description")}</p>
				</div>

				<Carousel
					className="mx-auto w-full max-w-5xl"
					opts={{
						align: "start",
						loop: true,
					}}
				>
					<CarouselContent>
						{projectsConfig.map((project) => (
							<CarouselItem className="md:basis-1/2 lg:basis-1/3" key={project.id}>
								<Card className="h-full border-slate-700 bg-slate-900/50 backdrop-blur transition-colors hover:border-lime-500/50">
									<CardHeader>
										<CardTitle className="text-white text-xl">{t(`projects.${project.id}.title`)}</CardTitle>
										<CardDescription className="text-slate-400">{t(`projects.${project.id}.description`)}</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="flex flex-wrap gap-2">
											{project.tech.map((tech) => (
												<Badge className="bg-teal-500/10 text-teal-400" key={tech} variant="secondary">
													{tech}
												</Badge>
											))}
										</div>
									</CardContent>
								</Card>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious className="hidden sm:flex" />
					<CarouselNext className="hidden sm:flex" />
				</Carousel>
			</div>
		</section>
	);
};
