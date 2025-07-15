'use client';

import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import {
  applyTheme,
  getInitialTheme,
  getSystemTheme,
  persistTheme,
  toggleThemeValue,
} from './theme-utils';
import type { Theme } from './types';

/**
 * Custom hook for managing theme state and persistence
 */
export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // Set theme from localStorage or system preference on mount (sync to avoid FOUC)
  useLayoutEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const stored = localStorage.getItem('theme') as Theme | null;
    const initialTheme = stored || getSystemTheme();
    setTheme(initialTheme);
  }, []);

  // Apply theme to document and persist in localStorage
  useEffect(() => {
    applyTheme(theme);
    persistTheme(theme);
  }, [theme]);

  // Listen for system preference changes
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    // Only listen if no stored preference exists
    const stored = localStorage.getItem('theme');
    if (stored) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => toggleThemeValue(prev));
  }, []);

  return { theme, toggleTheme };
};
