import { BookOpen } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function BlogPage() {
	const t = await getTranslations("BlogPage");
	const containerClasses = ["mx-auto", "max-w-3xl", "px-4", "py-20", "text-center"].join(" ");

	const iconWrapperClasses = ["inline-flex", "p-4", "items-center", "justify-center", "rounded-full", "bg-primary-100", "text-primary-700"].join(" ");

	const titleClasses = ["mt-6", "text-3xl", "font-semibold"].join(" ");

	return (
		<div className={containerClasses}>
			<div className={iconWrapperClasses}>
				<BookOpen size={28} />
			</div>
			<h1 className={titleClasses}>{t("comingSoonTitle")}</h1>
			<p className="mt-4 text-muted-foreground">{t("comingSoonBody")}</p>
		</div>
	);
}
