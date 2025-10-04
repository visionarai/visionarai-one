import Link from "next/link";
import { getTranslations } from "next-intl/server";

export async function Footer() {
	const t = await getTranslations("Footer");
	return (
		<footer className="flex w-full flex-col items-center gap-2 border-border border-t bg-background/80 px-6 py-6 backdrop-blur">
			<Link
				className="rounded bg-primary px-4 py-2 font-semibold text-primary-foreground text-sm transition-colors hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
				href="/#contact"
			>
				{t("contactCta", { default: "Contact" })}
			</Link>
			<div className="mt-2 flex gap-4 text-muted-foreground text-xs">
				<Link href="/#privacy">{t("links.privacy", { default: "Privacy Policy" })}</Link>
				<Link href="/#terms">{t("links.terms", { default: "Terms of Service" })}</Link>
			</div>
		</footer>
	);
}
