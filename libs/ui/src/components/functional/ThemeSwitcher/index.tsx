"use client";
import { MonitorCog, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Button } from "../../ui";

type ThemeSwitcherProps = {
	type?: "icon" | "extended";
};

export function ThemeSwitcher({ type = "icon" }: ThemeSwitcherProps) {
	const { setTheme, theme, themes } = useTheme();
	const [currentIndex, setCurrentIndex] = useState(themes.indexOf(theme || "system"));

	const onClick = () => {
		let nextIndex = currentIndex + 1;
		if (nextIndex >= themes.length) {
			nextIndex = 0;
		}
		setCurrentIndex(nextIndex);
		setTheme(themes[nextIndex]);
	};

	if (currentIndex === 0) {
		return (
			<Button aria-label="Switch to dark theme" onClick={onClick} size={type === "icon" ? "icon" : "lg"} variant="outline">
				<Moon /> {type === "extended" && "Dark"}
			</Button>
		);
	}

	if (currentIndex === 1) {
		return (
			<Button aria-label="Switch to light theme" onClick={onClick} size={type === "icon" ? "icon" : "lg"} variant="outline">
				<Sun /> {type === "extended" && "Light"}
			</Button>
		);
	}

	return (
		<Button aria-label="Switch to system theme" onClick={onClick} size={type === "icon" ? "icon" : "lg"} variant="outline">
			<MonitorCog /> {type === "extended" && "System"}
		</Button>
	);
}
