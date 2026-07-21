import type { ThemeConfig, IndustryTemplate } from '@neverleans/catalog-core';

export const defaultThemeBase: Omit<ThemeConfig, 'id' | 'name' | 'tagline'> = {
  colors: {
    primary: '217 91% 60%',
    primaryForeground: '0 0% 100%',
    secondary: '220 20% 14%',
    secondaryForeground: '210 40% 98%',
    accent: '170 80% 50%',
    accentForeground: '0 0% 0%',
    background: '0 0% 100%',
    foreground: '222 47% 11%',
    card: '0 0% 100%',
    cardForeground: '222 47% 11%',
    muted: '210 40% 96%',
    mutedForeground: '215.4 16.3% 46.9%',
    border: '214.3 31.8% 91.4%',
    heroGradientFrom: '222 40% 6%',
    heroGradientTo: '217 60% 20%',
  },
  fonts: {
    heading: '"Inter", sans-serif',
    body: '"Inter", sans-serif',
  },
  heroStyle: 'fullwidth',
  cardStyle: 'elevated',
  navStyle: 'standard',
};

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * defineTheme
 * 
 * Helper function to create custom themes or extend existing ones safely.
 */
export function defineTheme(
  config: Partial<ThemeConfig> & { id: IndustryTemplate | string; name: string; tagline: string }
): ThemeConfig {
  return {
    ...defaultThemeBase,
    ...config,
    id: config.id as IndustryTemplate,
    colors: {
      ...defaultThemeBase.colors,
      ...config.colors,
    },
    fonts: {
      ...defaultThemeBase.fonts,
      ...config.fonts,
    },
  };
}
