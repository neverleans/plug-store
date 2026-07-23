import { describe, it, expect } from 'vitest';
import { formatMoney } from '../lib/currency';

describe('formatMoney', () => {
  it('formats the amount as-is, with no cross-currency conversion', () => {
    // The old model multiplied by a rate (BRL = USD × 5.2), which mispriced any
    // store not operating in USD. A price is stored in the store's currency and
    // must display with the same number.
    expect(formatMoney(42, 'BRL')).toContain('42');
    expect(formatMoney(42, 'BRL')).not.toContain('218');
    expect(formatMoney(42, 'USD')).toContain('42');
  });

  it('uses the currency symbol and locale decimal formatting', () => {
    const brl = formatMoney(1234.5, 'BRL');
    expect(brl).toContain('R$');
    // pt-BR uses a comma decimal separator.
    expect(brl).toMatch(/1\.234,50/);

    const usd = formatMoney(1234.5, 'USD');
    expect(usd).toContain('$');
    expect(usd).toMatch(/1,234\.50/);
  });

  it('falls back to USD for an unknown currency', () => {
    // @ts-expect-error exercising the runtime guard with an invalid code
    expect(formatMoney(10, 'XYZ')).toContain('$');
  });
});
