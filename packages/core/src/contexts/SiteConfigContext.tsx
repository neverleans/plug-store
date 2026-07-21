import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

export type CurrencyCode = 'USD' | 'BRL' | 'EUR';

export interface Coupon {
  code: string;
  type: 'percent' | 'flat';
  value: number;
  label: string;
}

export interface SiteConfig {
  companyName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  footerText: string;
  shippingBanner: string;
  publicSlug: string;
  // ── new
  currency: CurrencyCode;
  logoDataUrl: string;      // base64
  faviconDataUrl: string;   // base64
  whatsappPhone: string;    // digits only, e.g. 5511998887777
  instagramUrl: string;
  tiktokUrl: string;
  facebookUrl: string;
  gaId: string;             // e.g. G-XXXXXXXX
  metaPixelId: string;      // numeric
  coupons: Coupon[];
  previewAsCustomer: boolean;
}

export const DEFAULT_COUPONS: Coupon[] = [
  { code: 'SAVE10',   type: 'percent', value: 10, label: '10% off' },
  { code: 'SAVE20',   type: 'percent', value: 20, label: '20% off' },
  { code: 'WELCOME5', type: 'flat',    value: 5,  label: '$5 off' },
  { code: 'FREESHIP', type: 'flat',    value: 0,  label: 'Free shipping' },
];

const DEFAULTS: SiteConfig = {
  companyName: '',
  tagline: '',
  contactEmail: '',
  contactPhone: '',
  address: '',
  footerText: '',
  shippingBanner: '',
  publicSlug: 'catalog',
  currency: 'USD',
  logoDataUrl: '',
  faviconDataUrl: '',
  whatsappPhone: '',
  instagramUrl: '',
  tiktokUrl: '',
  facebookUrl: '',
  gaId: '',
  metaPixelId: '',
  coupons: DEFAULT_COUPONS,
  previewAsCustomer: false,
};

const STORAGE_KEY = 'ecom-site-config';

interface Ctx {
  config: SiteConfig;
  updateConfig: (patch: Partial<SiteConfig>) => void;
  resetConfig: () => void;
  setPreviewAsCustomer: (v: boolean) => void;
}

const SiteConfigContext = createContext<Ctx | undefined>(undefined);

export const SiteConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<SiteConfig>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return {
        ...DEFAULTS,
        ...parsed,
        coupons: Array.isArray(parsed?.coupons) && parsed.coupons.length ? parsed.coupons : DEFAULT_COUPONS,
      };
    } catch {
      return DEFAULTS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  const updateConfig = useCallback(
    (patch: Partial<SiteConfig>) => setConfig((prev) => ({ ...prev, ...patch })),
    []
  );

  const resetConfig = useCallback(() => setConfig(DEFAULTS), []);
  const setPreviewAsCustomer = useCallback(
    (v: boolean) => setConfig((prev) => ({ ...prev, previewAsCustomer: v })),
    []
  );

  return (
    <SiteConfigContext.Provider value={{ config, updateConfig, resetConfig, setPreviewAsCustomer }}>
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = () => {
  const ctx = useContext(SiteConfigContext);
  if (!ctx) throw new Error('useSiteConfig must be used within SiteConfigProvider');
  return ctx;
};
