"use client";

import { Button } from "@visionarai-one/ui";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { memo, useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";

// Allowed locales for the language switcher
export type AllowedLocales = "en" | "de";

const LANGS: Array<{ code: AllowedLocales; label: string; longLabel: string }> = [
	{ code: "en", label: "EN", longLabel: "English" },
	{ code: "de", label: "DE", longLabel: "Deutsch" },
];

type LanguageButtonProps = {
	code: AllowedLocales;
	label: string;
	isActive: boolean;
	isPending: boolean;
	onSwitch: (locale: AllowedLocales) => void;
};

const LanguageButton = memo(function LanguageButtonA({ code, label, isActive, isPending, onSwitch }: LanguageButtonProps) {
	return (
		<Button
			aria-pressed={isActive}
			className="px-2 py-1 font-semibold text-xs"
			disabled={isPending}
			key={code}
			onClick={() => onSwitch(code)}
			size="sm"
			variant={isActive ? "default" : "secondary"}
		>
			{label}
		</Button>
	);
});

type LanguageSwitcherProps = {
	type?: "icon" | "extended";
};

export function LanguageSwitcher({ type }: LanguageSwitcherProps) {
	const router = useRouter();
	const currentPath = usePathname();
	const localeActive = useLocale();
	const searchParams = useSearchParams();
	const urlParams = new URLSearchParams(searchParams);
	const [isPending, startTransition] = useTransition();

	const selectedLocale = LANGS.find(({ code }) => code === localeActive) || LANGS[0];

	const handleSwitch = (locale: AllowedLocales) => {
		const searchParamString = urlParams.toString();

		startTransition(() => {
			router.push(`${currentPath}?${searchParamString}`, { locale });
		});
	};

	return (
		<div className="flex items-center gap-1">
			{LANGS.map(({ code, label, longLabel }) => (
				<LanguageButton
					code={code}
					isActive={selectedLocale.code === code}
					isPending={isPending}
					key={code}
					label={type === "extended" ? longLabel : label}
					onSwitch={handleSwitch}
				/>
			))}
		</div>
	);
}
