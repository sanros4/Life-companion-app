'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'pink' | 'lavender' | 'yellow';

const themes = {
  pink: {
    bg: '#fff0f5',
    bg2: '#ffe4ef',
    accent: '#f472b6',
    border: '#fbb6d4',
    text: '#7c3f5e',
    muted: '#c084a0',
    pixel: '#f9a8d4',
    card: '#ffffff',
  },
  lavender: {
    bg: '#f3f0ff',
    bg2: '#e9e4ff',
    accent: '#a78bfa',
    border: '#c4b5fd',
    text: '#4c1d95',
    muted: '#7c3aed',
    pixel: '#ddd6fe',
    card: '#ffffff',
  },
  yellow: {
    bg: '#fffbeb',
    bg2: '#fef3c7',
    accent: '#fbbf24',
    border: '#fde68a',
    text: '#78350f',
    muted: '#b45309',
    pixel: '#fde68a',
    card: '#ffffff',
  },
};

const ThemeContext = createContext<any>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('pink');

  // ✅ Load saved theme
  useEffect(() => {
    const saved = localStorage.getItem('lc_theme') as Theme;
    if (saved && themes[saved]) {
      setThemeState(saved);
    }
  }, []);

  // ✅ Apply theme to BODY (THIS IS IMPORTANT 🔥)
  useEffect(() => {
    document.body.classList.remove(
      'theme-pink',
      'theme-lavender',
      'theme-yellow'
    );

    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  // ✅ Change theme
  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem('lc_theme', t);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors: themes[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ✅ Hook
export const useTheme = () => useContext(ThemeContext);
