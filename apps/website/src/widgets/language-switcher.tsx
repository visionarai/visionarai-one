"use client";

import { Button } from "@visionarai-one/ui";
import { Languages } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";

// Allowed locales for the language switcher
export type AllowedLocales = "en" | "de";

type LanguageConfig = {
	code: AllowedLocales;
	label: string;
	longLabel: string;
	ariaLabel: string;
};

const LANGUAGES: Record<AllowedLocales, LanguageConfig> = {
	de: {
		ariaLabel: "Switch to German",
		code: "de",
		label: "DE",
		longLabel: "Deutsch",
	},
	en: {
		ariaLabel: "Switch to English",
		code: "en",
		label: "EN",
		longLabel: "English",
	},
};

type LanguageSwitcherProps = {
	type?: "icon" | "extended";
};

export function LanguageSwitcher({ type = "icon" }: LanguageSwitcherProps) {
	const router = useRouter();
	const currentPath = usePathname();
	const localeActive = useLocale() as AllowedLocales;
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	// Get current language configuration, fallback to English
	const currentLang = LANGUAGES[localeActive] || LANGUAGES.en;

	// Get all available languages as array for cycling
	const availableLanguages = Object.values(LANGUAGES);

	// Calculate next language in cycle
	const currentIndex = availableLanguages.findIndex((lang) => lang.code === localeActive);
	const nextIndex = (currentIndex + 1) % availableLanguages.length;
	const nextLang = availableLanguages[nextIndex];

	const handleLanguageToggle = () => {
		const urlParams = new URLSearchParams(searchParams);
		const searchParamString = urlParams.toString();
		const targetPath = searchParamString ? `${currentPath}?${searchParamString}` : currentPath;

		startTransition(() => {
			router.push(targetPath, { locale: nextLang.code });
		});
	};

	return (
		<Button
			aria-label={nextLang.ariaLabel}
			className="transition-all"
			disabled={isPending}
			onClick={handleLanguageToggle}
			size={type === "icon" ? "icon" : "lg"}
			variant="outline"
		>
			{type === "extended" && <Languages className="h-[1.2rem] w-[1.2rem]" />}
			{type === "extended" ? currentLang.longLabel : currentLang.label}
		</Button>
	);
}
