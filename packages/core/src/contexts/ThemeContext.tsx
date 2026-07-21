import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IndustryTemplate, ThemeConfig } from '@/types';
import { themeConfigs } from '@/themes/configs';

interface ThemeContextType {
  template: IndustryTemplate;
  theme: ThemeConfig;
  setTemplate: (t: IndustryTemplate) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [template, setTemplate] = useState<IndustryTemplate>(
    () => (localStorage.getItem('ecom-template') as IndustryTemplate) || 'fashion'
  );

  const theme = themeConfigs[template];

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
    <ThemeContext.Provider value={{ template, theme, setTemplate }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
