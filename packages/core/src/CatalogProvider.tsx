import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { TooltipProvider } from './components/ui/tooltip';
import { Toaster } from './components/ui/toaster';
import { Toaster as Sonner } from './components/ui/sonner';
import { ThemeProvider } from './contexts/ThemeContext';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ColorModeProvider } from './contexts/ColorModeContext';
import { CompareProvider } from './contexts/CompareContext';
import { RecentlyViewedProvider } from './contexts/RecentlyViewedContext';
import { AccountProvider } from './contexts/AccountContext';
import { SiteConfigProvider } from './contexts/SiteConfigContext';
import { DataProviderWrapper } from './contexts/DataContext';
import type { CatalogDataProvider } from './data/provider';
import type { IndustryTemplate, ThemeConfig } from './types';
import type { CurrencyCode } from './contexts/SiteConfigContext';
import type { Language } from './i18n';

export interface CatalogConfig {
  /** Your store/brand name */
  companyName?: string;
  /** Store tagline */
  tagline?: string;
  /** Contact email shown in footer */
  contactEmail?: string;
  /** Contact phone shown in footer */
  contactPhone?: string;
  /** Physical address */
  address?: string;
  /** Footer copyright text */
  footerText?: string;
  /** Top shipping banner message */
  shippingBanner?: string;
  /** Public catalog slug, e.g. "my-store" → accessible at /c/my-store */
  publicSlug?: string;
  /** Currency to display prices in */
  currency?: CurrencyCode;
  /** Base64 encoded logo image */
  logoDataUrl?: string;
  /** Base64 encoded favicon image */
  faviconDataUrl?: string;
  /** WhatsApp phone number (digits only, e.g. 5511998887777) */
  whatsappPhone?: string;
  /** Instagram profile URL */
  instagramUrl?: string;
  /** TikTok profile URL */
  tiktokUrl?: string;
  /** Facebook profile URL */
  facebookUrl?: string;
  /** Google Analytics 4 measurement ID (e.g. G-XXXXXXXX) */
  gaId?: string;
  /** Meta Pixel ID (numeric string) */
  metaPixelId?: string;
}

export interface CatalogProviderProps {
  children: ReactNode;
  /** Initial industry theme to load. Consumers can also use ThemeSwitcher to change at runtime. */
  defaultTheme?: IndustryTemplate | string;
  /** Pass a custom theme created with defineTheme */
  customTheme?: ThemeConfig;
  /** Initial UI language */
  defaultLanguage?: Language;
  /** Store configuration — overrides localStorage defaults */
  config?: CatalogConfig;
  /** Optional custom Headless Data Provider (REST, GraphQL, Supabase, etc.) */
  dataProvider?: CatalogDataProvider;
}

const defaultQueryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
});

/**
 * CatalogProvider
 *
 * Single wrapper that sets up every context your catalog needs.
 * Wrap your app (or page) once and get access to custom/built-in theming, cart,
 * wishlist, compare, recently-viewed, auth, account, i18n, data-provider, and color mode.
 *
 * @example
 * ```tsx
 * import { CatalogProvider } from '@neverleans/plug-store-core';
 * import { defineTheme } from '@neverleans/plug-store-themes';
 *
 * const clienteTheme = defineTheme({
 *   id: 'minha-marca',
 *   name: 'Minha Marca',
 *   tagline: 'Estilo Próprio',
 *   colors: { primary: '210 100% 50%', background: '0 0% 98%' },
 * });
 *
 * function App() {
 *   return (
 *     <CatalogProvider customTheme={clienteTheme}>
 *       <YourAppContent />
 *     </CatalogProvider>
 *   );
 * }
 * ```
 */
export const CatalogProvider = ({
  children,
  defaultTheme = 'fashion',
  customTheme,
  defaultLanguage,
  config,
  dataProvider,
}: CatalogProviderProps) => {
  // Merge config into localStorage defaults before providers mount
  if (config && typeof window !== 'undefined') {
    try {
      const stored = JSON.parse(localStorage.getItem('ecom-site-config') || '{}');
      const merged = { ...stored, ...config };
      localStorage.setItem('ecom-site-config', JSON.stringify(merged));
    } catch {}
  }

  if (defaultLanguage && typeof window !== 'undefined') {
    if (!localStorage.getItem('language')) {
      localStorage.setItem('language', defaultLanguage);
    }
  }

  return (
    <QueryClientProvider client={defaultQueryClient}>
      <HelmetProvider>
        <LanguageProvider>
          <ColorModeProvider>
            <SiteConfigProvider>
              <ThemeProvider defaultTheme={defaultTheme as IndustryTemplate} customTheme={customTheme}>
                <DataProviderWrapper dataProvider={dataProvider}>
                  <CartProvider>
                    <AuthProvider>
                      <AccountProvider>
                        <WishlistProvider>
                          <CompareProvider>
                            <RecentlyViewedProvider>
                              <TooltipProvider>
                                <Toaster />
                                <Sonner />
                                {children}
                              </TooltipProvider>
                            </RecentlyViewedProvider>
                          </CompareProvider>
                        </WishlistProvider>
                      </AccountProvider>
                    </AuthProvider>
                  </CartProvider>
                </DataProviderWrapper>
              </ThemeProvider>
            </SiteConfigProvider>
          </ColorModeProvider>
        </LanguageProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};
