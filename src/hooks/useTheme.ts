import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme') as Theme;
    return saved || 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const systemTheme = mediaQuery.matches ? 'dark' : 'light';

    const updateResolvedTheme = () => {
      const resolved = theme === 'system' ? systemTheme : theme;
      setResolvedTheme(resolved as 'light' | 'dark');
      
      // Update CSS custom properties and color-scheme
      document.documentElement.style.setProperty('--theme', resolved);
      document.documentElement.style.colorScheme = resolved;
    };

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        const newSystemTheme = e.matches ? 'dark' : 'light';
        setResolvedTheme(newSystemTheme);
        document.documentElement.style.setProperty('--theme', newSystemTheme);
        document.documentElement.style.colorScheme = newSystemTheme;
      }
    };

    updateResolvedTheme();
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [theme]);

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return {
    theme,
    resolvedTheme,
    changeTheme,
  };
} 