"use client";
import { type LucideIcon, MonitorCog, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "../../ui";

type ThemeSwitcherProps = {
	type?: "icon" | "extended";
	lightLabel?: string;
	darkLabel?: string;
	systemLabel?: string;
};

type ThemeConfig = {
	icon: LucideIcon;
	label: string;
	ariaLabel: string;
	nextTheme: string;
};

export function ThemeSwitcher({ type = "icon", lightLabel = "Light", darkLabel = "Dark", systemLabel = "System" }: ThemeSwitcherProps) {
	const { setTheme, theme, themes } = useTheme();

	// Normalize current theme, defaulting to "system" if undefined
	const currentTheme = theme || "system";

	// Theme configuration mapping
	const themeConfig: Record<string, ThemeConfig> = {
		dark: {
			ariaLabel: `Switch to ${systemLabel.toLowerCase()} theme`,
			icon: Moon,
			label: darkLabel,
			nextTheme: themes[(themes.indexOf("dark") + 1) % themes.length] || "system",
		},
		light: {
			ariaLabel: `Switch to ${darkLabel.toLowerCase()} theme`,
			icon: Sun,
			label: lightLabel,
			nextTheme: themes[(themes.indexOf("light") + 1) % themes.length] || "dark",
		},
		system: {
			ariaLabel: `Switch to ${lightLabel.toLowerCase()} theme`,
			icon: MonitorCog,
			label: systemLabel,
			nextTheme: themes[(themes.indexOf("system") + 1) % themes.length] || "light",
		},
	};

	// Get current theme configuration, fallback to system if theme not found
	const config = themeConfig[currentTheme] || themeConfig.system;
	const Icon = config.icon;

	const handleThemeToggle = () => {
		const currentIndex = themes.indexOf(currentTheme);
		const nextIndex = (currentIndex + 1) % themes.length;
		setTheme(themes[nextIndex]);
	};

	return (
		<Button aria-label={config.ariaLabel} className="transition-all" onClick={handleThemeToggle} size={type === "icon" ? "icon" : "lg"} variant="outline">
			<Icon className="h-[1.2rem] w-[1.2rem]" />
			{type === "extended" && <span className="ml-2">{config.label}</span>}
		</Button>
	);
}
