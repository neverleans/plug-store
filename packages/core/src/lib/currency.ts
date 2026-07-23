import { useSiteConfig, CurrencyCode } from '@/contexts/SiteConfigContext';

export const CURRENCIES: Record<CurrencyCode, { symbol: string; locale: string; code: string }> = {
  USD: { symbol: '$', locale: 'en-US', code: 'USD' },
  BRL: { symbol: 'R$', locale: 'pt-BR', code: 'BRL' },
  EUR: { symbol: '€', locale: 'de-DE', code: 'EUR' },
};

/**
 * Format an amount that is already denominated in `currency`.
 *
 * A store operates in a single currency and its prices are stored in that
 * currency — there is no cross-currency conversion. Switching the store currency
 * changes how amounts are formatted (symbol, grouping, decimals via the locale),
 * not a live exchange rate. This is what a real single-currency store needs;
 * the previous USD-base × rate model mispriced any store that was not in USD.
 */
export const formatMoney = (amount: number, currency: CurrencyCode = 'USD'): string => {
  const c = CURRENCIES[currency] ?? CURRENCIES.USD;
  try {
    return new Intl.NumberFormat(c.locale, { style: 'currency', currency: c.code }).format(amount);
  } catch {
    return `${c.symbol}${amount.toFixed(2)}`;
  }
};

/** Hook returning a formatter bound to the active store currency. */
export const useMoney = () => {
  const { config } = useSiteConfig();
  const cur = config.currency;
  const fmt = (amount: number) => formatMoney(amount, cur);
  fmt.currency = cur;
  fmt.symbol = CURRENCIES[cur].symbol;
  return fmt;
};
