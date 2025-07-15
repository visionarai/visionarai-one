'use client';
import { Moon, Sun } from 'lucide-react';
import { memo } from 'react';
import { useTheme } from './use-theme';

/**
 * Theme switcher button component
 */
export const ThemeSwitcher = memo(() => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      aria-label="Toggle theme"
      className="ml-2 rounded bg-muted p-2 transition-colors hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      onClick={toggleTheme}
      type="button"
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
});

ThemeSwitcher.displayName = 'ThemeSwitcher';
