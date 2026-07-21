import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IndustryTemplate, ThemeConfig } from '@/types';
import { themeConfigs } from '@/themes/configs';

interface ThemeContextType {
  template: IndustryTemplate;
  theme: ThemeConfig;
  setTemplate: (t: IndustryTemplate) => void;
  registerCustomTheme: (customTheme: ThemeConfig) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export interface ThemeProviderProps {
  children: ReactNode;
  /** Optional custom theme passed directly by the developer */
  customTheme?: ThemeConfig;
}

export const ThemeProvider = ({ children, customTheme }: ThemeProviderProps) => {
  const [registry, setRegistry] = useState<Record<string, ThemeConfig>>(() => {
    const base = { ...themeConfigs };
    if (customTheme) {
      base[customTheme.id] = customTheme;
    }
    return base;
  });

  const [template, setTemplateState] = useState<IndustryTemplate>(() => {
    if (customTheme) return customTheme.id;
    return (localStorage.getItem('ecom-template') as IndustryTemplate) || 'fashion';
  });

  const setTemplate = (t: IndustryTemplate) => {
    setTemplateState(t);
  };

  // Dynamically register new themes at runtime
  const registerCustomTheme = (theme: ThemeConfig) => {
    setRegistry((prev) => ({ ...prev, [theme.id]: theme }));
  };

  const theme = registry[template] || customTheme || themeConfigs.fashion;

  useEffect(() => {
    localStorage.setItem('ecom-template', template);
    const root = document.documentElement;

    // Enable crossfade transitions on token swap
    root.classList.add('theme-transition');

    const c = theme.colors;
    root.style.setProperty('--primary', c.primary);
    root.style.setProperty('--primary-foreground', c.primaryForeground);
    root.style.setProperty('--secondary', c.secondary);
    root.style.setProperty('--secondary-foreground', c.secondaryForeground);
    root.style.setProperty('--accent', c.accent);
    root.style.setProperty('--accent-foreground', c.accentForeground);
    root.style.setProperty('--background', c.background);
    root.style.setProperty('--foreground', c.foreground);
    root.style.setProperty('--card', c.card);
    root.style.setProperty('--card-foreground', c.cardForeground);
    root.style.setProperty('--muted', c.muted);
    root.style.setProperty('--muted-foreground', c.mutedForeground);
    root.style.setProperty('--border', c.border);
    root.style.setProperty('--input', c.border);
    root.style.setProperty('--ring', c.primary);
    root.style.fontFamily = theme.fonts.body;

    // Remove the transition class after the animation completes
    const timeout = window.setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 600);
    return () => window.clearTimeout(timeout);
  }, [template, theme]);

  return (
    <ThemeContext.Provider
      value={{
        template,
        theme,
        setTemplate,
        registerCustomTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
