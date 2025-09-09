import type { Theme } from "./types";

/**
 * Gets the system's preferred color scheme
 */
export const getSystemTheme = (): Theme => (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

/**
 * Gets the initial theme from localStorage or system preference
 */
export const getInitialTheme = (): Theme => {
	if (typeof window === "undefined") {
		return "light";
	}
	const stored = localStorage.getItem("theme") as Theme | null;
	return stored || getSystemTheme();
};

/**
 * Applies theme to the document root element
 */
export const applyTheme = (theme: Theme): void => {
	if (typeof document === "undefined") {
		return;
	}

	const root = document.documentElement;
	const otherTheme = theme === "light" ? "dark" : "light";

	if (!root.classList.contains(theme)) {
		root.classList.remove(otherTheme);
		root.classList.add(theme);
	}
};

/**
 * Persists theme to localStorage
 */
export const persistTheme = (theme: Theme): void => {
	if (typeof window === "undefined") {
		return;
	}
	localStorage.setItem("theme", theme);
};

/**
 * Toggles between light and dark theme
 */
export const toggleThemeValue = (currentTheme: Theme): Theme => (currentTheme === "light" ? "dark" : "light");
