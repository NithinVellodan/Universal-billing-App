import React, { createContext, useContext, useState, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { colors, darkColors, ColorTheme } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { radius } from './radius';
import { shadows } from './shadows';

export interface Theme {
  isDark: boolean;
  colors: ColorTheme;
  typography: typeof typography;
  spacing: typeof spacing;
  radius: typeof radius;
  shadows: typeof shadows;
  toggleTheme: () => void;
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
  themeMode: 'light' | 'dark' | 'system';
}

const ThemeContext = createContext<Theme | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('light');

  const isDark = useMemo(() => {
    if (themeMode === 'system') {
      return systemColorScheme === 'dark';
    }
    return themeMode === 'dark';
  }, [themeMode, systemColorScheme]);

  const activeColors = useMemo(() => (isDark ? darkColors : colors), [isDark]);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const value: Theme = useMemo(
    () => ({
      isDark,
      colors: activeColors,
      typography,
      spacing,
      radius,
      shadows,
      toggleTheme,
      setThemeMode,
      themeMode,
    }),
    [isDark, activeColors, themeMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): Theme => {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      isDark: false,
      colors,
      typography,
      spacing,
      radius,
      shadows,
      toggleTheme: () => {},
      setThemeMode: () => {},
      themeMode: 'light',
    };
  }
  return context;
};
