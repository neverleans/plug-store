import { describe, it, expect } from 'vitest';
import { buildPixPayload, pixCrc16 } from '../lib/pix';

/** Parse an EMV MPM TLV string into a flat map of id -> raw value. */
function parseTLV(payload: string): Record<string, string> {
  const out: Record<string, string> = {};
  let i = 0;
  while (i < payload.length) {
    const id = payload.slice(i, i + 2);
    const len = parseInt(payload.slice(i + 2, i + 4), 10);
    out[id] = payload.slice(i + 4, i + 4 + len);
    i += 4 + len;
  }
  return out;
}

describe('pixCrc16', () => {
  it('matches the canonical CRC-16/CCITT-FALSE check vector', () => {
    // "123456789" -> 0x29B1 is the standard check value for this CRC variant.
    expect(pixCrc16('123456789')).toBe('29B1');
  });

  it('produces four uppercase hex digits, zero-padded', () => {
    expect(pixCrc16('A')).toMatch(/^[0-9A-F]{4}$/);
  });
});

describe('buildPixPayload', () => {
  const base = {
    pixKey: 'loja@exemplo.com.br',
    merchantName: 'Loja Exemplo',
    merchantCity: 'Sao Paulo',
    amount: 99.9,
  };

  it('starts with the payload format indicator', () => {
    expect(buildPixPayload(base).startsWith('000201')).toBe(true);
  });

  it('is a self-consistent BR Code: the trailing CRC checks out', () => {
    const code = buildPixPayload(base);
    const body = code.slice(0, -4);
    const crc = code.slice(-4);
    expect(pixCrc16(body)).toBe(crc);
    expect(body.endsWith('6304')).toBe(true);
  });

  it('nests the Pix key under br.gov.bcb.pix in the merchant account field', () => {
    const fields = parseTLV(buildPixPayload(base));
    const merchant = parseTLV(fields['26']);
    expect(merchant['00']).toBe('br.gov.bcb.pix');
    expect(merchant['01']).toBe('loja@exemplo.com.br');
  });

  it('encodes the amount with two decimals in BRL', () => {
    const fields = parseTLV(buildPixPayload(base));
    expect(fields['53']).toBe('986');
    expect(fields['54']).toBe('99.90');
  });

  it('omits the amount field entirely when no amount is given', () => {
    const fields = parseTLV(buildPixPayload({ ...base, amount: undefined }));
    expect(fields['54']).toBeUndefined();
  });

  it('ASCII-folds and upper-cases the merchant name and city', () => {
    const fields = parseTLV(
      buildPixPayload({ ...base, merchantName: 'Padaria Açúcar', merchantCity: 'Brasília' }),
    );
    expect(fields['59']).toBe('PADARIA ACUCAR');
    expect(fields['60']).toBe('BRASILIA');
  });

  it('defaults the reference label to *** when no txid is given', () => {
    const fields = parseTLV(buildPixPayload(base));
    const additional = parseTLV(fields['62']);
    expect(additional['05']).toBe('***');
  });

  it('rejects a missing Pix key', () => {
    expect(() => buildPixPayload({ ...base, pixKey: '' })).toThrow(/pixKey/);
  });

  it('caps the merchant name at 25 characters', () => {
    const fields = parseTLV(
      buildPixPayload({ ...base, merchantName: 'A'.repeat(40) }),
    );
    expect(fields['59'].length).toBe(25);
  });
});
