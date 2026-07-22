/**
 * Static Pix "Copia e Cola" BR Code generator.
 *
 * Implements the Banco Central do Brasil / EMV® MPM payload so the string this
 * produces is a real, scannable Pix code — paste it into a banking app and it
 * resolves to the merchant's key. This is the free-tier static Pix: no API, no
 * webhook, no reconciliation. The maintained dynamic Pix (payment confirmation
 * via a PSP) is a separate, paid concern.
 *
 * Spec references: EMV QRCPS-MPM and the BCB "Manual de Padrões para Iniciação
 * do Pix". Fields are TLV — a two-digit id, a two-digit length, then the value.
 */

export interface PixStaticParams {
  /** The merchant's Pix key: CPF, CNPJ, e-mail, phone (+55…), or random key. */
  pixKey: string;
  /** Beneficiary name shown to the payer. Truncated to 25 chars, ASCII-folded. */
  merchantName: string;
  /** Merchant city. Truncated to 15 chars, ASCII-folded. */
  merchantCity: string;
  /** Optional amount in BRL. Omit for a payer-defined amount. */
  amount?: number;
  /** Optional reference/txid, max 25 chars. Defaults to "***" (unreserved). */
  txid?: string;
}

/**
 * CRC-16/CCITT-FALSE: polynomial 0x1021, initial value 0xFFFF, no input or
 * output reflection. This is the exact variant the Pix spec mandates over the
 * whole payload including the "6304" tag of the CRC field itself.
 */
export function pixCrc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/** Encode one TLV field: id + zero-padded length + value. */
const tlv = (id: string, value: string): string =>
  id + value.length.toString().padStart(2, '0') + value;

/**
 * Fold to the printable-ASCII subset the spec allows for names and cities:
 * strip accents, drop anything non-ASCII, upper-case, then truncate.
 */
// After NFD, an accented letter becomes its base letter plus a combining mark in
// U+0300+, which is non-ASCII and so is removed here along with any other
// out-of-range character the spec disallows in names and cities.
const NON_ASCII = /[^\x20-\x7e]/g;

const fold = (text: string, max: number): string =>
  text
    .normalize('NFD')
    .replace(NON_ASCII, '')
    .toUpperCase()
    .trim()
    .slice(0, max);

/**
 * Build a static Pix BR Code ("Pix Copia e Cola").
 *
 * @returns the full payload string, CRC included, ready to render as text or QR.
 */
export function buildPixPayload({
  pixKey,
  merchantName,
  merchantCity,
  amount,
  txid = '***',
}: PixStaticParams): string {
  if (!pixKey) throw new Error('pixKey is required to build a Pix payload');

  const merchantAccount = tlv(
    '26',
    tlv('00', 'br.gov.bcb.pix') + tlv('01', pixKey),
  );

  const reference = fold(txid, 25) || '***';

  const body =
    tlv('00', '01') + // payload format indicator
    tlv('01', '11') + // point of initiation: static, reusable
    merchantAccount +
    tlv('52', '0000') + // merchant category code: none
    tlv('53', '986') + // currency: BRL
    (amount != null && amount > 0 ? tlv('54', amount.toFixed(2)) : '') +
    tlv('58', 'BR') + // country
    tlv('59', fold(merchantName, 25) || 'RECEBEDOR') +
    tlv('60', fold(merchantCity, 15) || 'BRASIL') +
    tlv('62', tlv('05', reference)); // additional data: reference label

  // The CRC is computed over the body plus the CRC field's own id and length.
  const toChecksum = body + '6304';
  return toChecksum + pixCrc16(toChecksum);
}
