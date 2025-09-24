"use client";
import { MonitorCog, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Button } from "../../ui";

export function ThemeSwitcher() {
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
			<Button aria-label="Switch to dark theme" onClick={onClick} size="icon" variant="outline">
				<Moon />
			</Button>
		);
	}

	if (currentIndex === 1) {
		return (
			<Button aria-label="Switch to light theme" onClick={onClick} size="icon" variant="outline">
				<Sun />
			</Button>
		);
	}

	return (
		<Button aria-label="Switch to system theme" onClick={onClick} size="icon" variant="outline">
			<MonitorCog />
		</Button>
	);
}
