import { useSiteConfig, CurrencyCode } from '@/contexts/SiteConfigContext';

// USD-based rates (approx, demo-only)
export const CURRENCIES: Record<CurrencyCode, { symbol: string; rate: number; locale: string; code: string }> = {
  USD: { symbol: '$',  rate: 1,    locale: 'en-US', code: 'USD' },
  BRL: { symbol: 'R$', rate: 5.2,  locale: 'pt-BR', code: 'BRL' },
  EUR: { symbol: '€',  rate: 0.92, locale: 'de-DE', code: 'EUR' },
};

export const formatMoney = (usd: number, currency: CurrencyCode = 'USD'): string => {
  const c = CURRENCIES[currency] ?? CURRENCIES.USD;
  const converted = usd * c.rate;
  return `${c.symbol}${converted.toFixed(2)}`;
};

/** Hook returning a formatter bound to the active site currency. */
export const useMoney = () => {
  const { config } = useSiteConfig();
  const cur = config.currency;
  const fmt = (usd: number) => formatMoney(usd, cur);
  fmt.currency = cur;
  fmt.symbol = CURRENCIES[cur].symbol;
  return fmt;
};
