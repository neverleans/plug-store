import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CatalogApp } from '../CatalogApp';
import type { ThemeConfig } from '../types';

/**
 * CatalogApp forwards props to CatalogProvider. A prop that is declared but never
 * destructured compiles and renders fine while silently doing nothing, which is how
 * customTheme shipped broken: the README documented it, the demo app used it, and it
 * was dropped on the floor. These tests assert the forwarding actually happens.
 */

const brandTheme: ThemeConfig = {
  id: 'test-brand',
  name: 'TEST BRAND STORE',
  tagline: 'Only visible when customTheme is forwarded',
  colors: {
    primary: '210 100% 50%',
    primaryForeground: '0 0% 100%',
    secondary: '210 20% 20%',
    secondaryForeground: '0 0% 100%',
    accent: '210 80% 60%',
    accentForeground: '0 0% 0%',
    background: '210 20% 98%',
    foreground: '210 20% 10%',
    card: '0 0% 100%',
    cardForeground: '210 20% 10%',
    muted: '210 20% 94%',
    mutedForeground: '210 10% 40%',
    border: '210 20% 88%',
    heroGradientFrom: '210 100% 45%',
    heroGradientTo: '230 80% 30%',
  },
  fonts: { heading: '"Inter", sans-serif', body: '"Inter", sans-serif' },
  heroStyle: 'split',
  cardStyle: 'bordered',
  navStyle: 'elegant',
};

describe('CatalogApp', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders a built-in theme without crashing', () => {
    render(<CatalogApp defaultTheme="fashion" />);
    expect(document.querySelector('main')).toBeInTheDocument();
  });

  it('applies defaultTheme on a first visit', () => {
    render(<CatalogApp defaultTheme="bakery" />);
    expect(localStorage.getItem('ecom-template')).toBe('bakery');
  });

  it('applies defaultTheme even when another theme is already stored', () => {
    // The original bug: defaultTheme was only seeded when the key was absent, so
    // every visitor who had loaded any store before was pinned to the stale theme.
    localStorage.setItem('ecom-template', 'fashion');
    localStorage.setItem('ecom-template-default', 'fashion');

    render(<CatalogApp defaultTheme="bakery" />);

    expect(localStorage.getItem('ecom-template')).toBe('bakery');
  });

  it('keeps a visitor theme switch while the configured default is unchanged', () => {
    localStorage.setItem('ecom-template', 'coffee');
    localStorage.setItem('ecom-template-default', 'bakery');

    render(<CatalogApp defaultTheme="bakery" />);

    expect(localStorage.getItem('ecom-template')).toBe('coffee');
  });

  it('forwards customTheme so a defineTheme brand actually takes effect', () => {
    render(<CatalogApp customTheme={brandTheme} />);
    expect(screen.getAllByText(/TEST BRAND STORE/i).length).toBeGreaterThan(0);
  });

  it('forwards config so the store name overrides the theme name', () => {
    render(<CatalogApp defaultTheme="fashion" config={{ companyName: 'MINHA LOJA' }} />);
    expect(screen.getAllByText(/MINHA LOJA/i).length).toBeGreaterThan(0);
  });
});
