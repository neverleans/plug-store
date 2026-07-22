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

const TEMPLATE_KEY = 'ecom-template';
/**
 * Records which configured default the stored template was derived from. Without it a
 * stale stored value shadows defaultTheme forever, so changing defaultTheme in code
 * appears to do nothing on every machine that has already loaded the app once.
 */
const TEMPLATE_ORIGIN_KEY = 'ecom-template-default';

export interface ThemeProviderProps {
  children: ReactNode;
  /** Theme to use when the visitor has not explicitly switched themes */
  defaultTheme?: IndustryTemplate;
  /** Optional custom theme passed directly by the developer */
  customTheme?: ThemeConfig;
}

export const ThemeProvider = ({
  children,
  defaultTheme = 'fashion',
  customTheme,
}: ThemeProviderProps) => {
  const [registry, setRegistry] = useState<Record<string, ThemeConfig>>(() => {
    const base = { ...themeConfigs };
    if (customTheme) {
      base[customTheme.id] = customTheme;
    }
    return base;
  });

  const [template, setTemplateState] = useState<IndustryTemplate>(() => {
    if (customTheme) return customTheme.id;
    if (typeof window === 'undefined') return defaultTheme;

    const stored = localStorage.getItem(TEMPLATE_KEY) as IndustryTemplate | null;
    const origin = localStorage.getItem(TEMPLATE_ORIGIN_KEY);

    // Keep a visitor's own switch, but only while the app still ships the same
    // default. Once defaultTheme changes, the new value wins.
    if (stored && origin === defaultTheme) return stored;
    return defaultTheme;
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
    localStorage.setItem(TEMPLATE_KEY, template);
    localStorage.setItem(TEMPLATE_ORIGIN_KEY, defaultTheme);
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
  }, [template, theme, defaultTheme]);

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
