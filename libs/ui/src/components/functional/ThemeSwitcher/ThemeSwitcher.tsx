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
      type="button"
      aria-label="Toggle theme"
      className="ml-2 p-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-muted hover:bg-accent transition-colors"
      onClick={toggleTheme}>
      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
});

ThemeSwitcher.displayName = 'ThemeSwitcher';
