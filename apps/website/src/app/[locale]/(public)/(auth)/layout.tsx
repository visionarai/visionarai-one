import { VisionaraiLogo } from "@visionarai-one/ui";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
	const t = await getTranslations();

	return (
		<div className="flex h-full flex-col md:flex-row">
			{/* Left Panel - Branding */}
			<aside className="relative hidden w-full bg-gradient-to-br from-primary/10 via-primary/5 to-background md:flex md:w-1/2 lg:w-2/5">
				<div className="flex flex-col justify-between p-8 lg:p-12">
					{/* Logo */}
					<Link className="group inline-flex items-center gap-2 font-bold text-2xl transition-opacity hover:opacity-80" href="/">
						<VisionaraiLogo size={58} />
					</Link>

					{/* Hero Content */}
					<div className="space-y-6">
						<div className="space-y-4">
							<h1 className="font-bold text-3xl text-foreground leading-tight tracking-tight lg:text-4xl">{t("LandingPage.hero.headline")}</h1>
							<p className="text-base text-muted-foreground lg:text-lg">{t("LandingPage.hero.subheadline")}</p>
						</div>

						{/* Decorative Elements */}
						<div className="flex items-center gap-4 pt-8">
							<div className="-space-x-2 flex">
								<div className="h-10 w-10 rounded-full border-2 border-background bg-primary/20" />
								<div className="h-10 w-10 rounded-full border-2 border-background bg-primary/40" />
								<div className="h-10 w-10 rounded-full border-2 border-background bg-primary/60" />
							</div>
							<p className="text-muted-foreground text-sm">Join innovators building the future</p>
						</div>
					</div>

					{/* Footer Quote */}
					<div className="border-primary/30 border-l-2 pl-4">
						<p className="text-muted-foreground text-sm italic">"Transform your ideas into AI-powered reality"</p>
					</div>
				</div>

				{/* Background Pattern */}
				<div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]" />
			</aside>

			{/* Right Panel - Form Content */}
			<main className="flex h-full w-full flex-col items-center justify-center bg-background p-4 md:w-1/2 md:p-8 lg:w-3/5">
				{/* Mobile Logo */}
				<Link className="my-16 inline-flex items-center gap-2 font-bold text-foreground text-xl md:hidden" href="/">
					<VisionaraiLogo followCursor={false} size={64} />
				</Link>

				{/* Form Container */}
				<div className="w-full max-w-md flex-1 md:flex-none">{children}</div>

				{/* Footer Links */}
				<footer className="mt-8 text-center text-muted-foreground text-sm">
					<p>
						By continuing, you agree to our{" "}
						<Link className="underline hover:text-foreground" href="/terms">
							Terms of Service
						</Link>{" "}
						and{" "}
						<Link className="underline hover:text-foreground" href="/privacy">
							Privacy Policy
						</Link>
					</p>
				</footer>
			</main>
		</div>
	);
}
