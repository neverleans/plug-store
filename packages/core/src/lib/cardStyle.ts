import type { ThemeConfig } from '@/types';

/**
 * Returns Tailwind classes for a "panel" surface (cart/checkout sections,
 * order summaries, form cards) that matches the active theme's cardStyle.
 * Mirrors the visual language used by ProductCard so the cart/checkout
 * feels consistent with the rest of the storefront.
 */
export const panelClasses = (cardStyle: ThemeConfig['cardStyle']): string => {
  switch (cardStyle) {
    case 'elevated':
      return 'rounded-xl bg-card shadow-lg';
    case 'bordered':
      return 'rounded-lg border-2 border-border bg-card';
    case 'minimal':
      return 'rounded-md bg-card border border-border/60';
    case 'rounded':
      return 'rounded-2xl bg-card shadow-md';
    case 'tilted':
      return 'rounded-md bg-card border-2 border-foreground shadow-[6px_6px_0_0_hsl(var(--primary))]';
    case 'paper':
      return 'rounded-sm bg-card border border-border shadow-sm relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary';
    case 'soft':
      return 'rounded-3xl bg-card shadow-[0_8px_30px_-10px_hsl(var(--primary)/0.3)]';
    case 'metal':
      return 'rounded-none bg-card border border-border shadow-[inset_0_1px_0_hsl(var(--accent)/0.2)]';
    case 'frame':
      return 'bg-card p-1 border-[6px] border-foreground/90 shadow-[0_2px_10px_rgba(0,0,0,0.1)]';
    case 'sharp':
      return 'rounded-none bg-card border border-border';
    default:
      return 'rounded-lg border bg-card';
  }
};
