import { useMemo, useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { translate } from '@docusaurus/Translate';
import { buildPixPayload, pixCrc16 } from '@neverleans-labs/plug-store-core';
import styles from './styles.module.css';

/**
 * Human names for the EMV/BCB field ids PlugStore emits. Built lazily so the
 * labels follow the page locale — the prose table right above this component is
 * translated, and a half-English table beside it reads like a bug.
 */
const fieldNames = (): Record<string, string> => ({
  '00': translate({ id: 'pix.tlv.00', message: 'Payload format indicator' }),
  '01': translate({ id: 'pix.tlv.01', message: 'Point of initiation' }),
  '26': translate({ id: 'pix.tlv.26', message: 'Merchant account (Pix)' }),
  '52': translate({ id: 'pix.tlv.52', message: 'Merchant category code' }),
  '53': translate({ id: 'pix.tlv.53', message: 'Transaction currency' }),
  '54': translate({ id: 'pix.tlv.54', message: 'Transaction amount' }),
  '58': translate({ id: 'pix.tlv.58', message: 'Country code' }),
  '59': translate({ id: 'pix.tlv.59', message: 'Beneficiary name' }),
  '60': translate({ id: 'pix.tlv.60', message: 'Beneficiary city' }),
  '62': translate({ id: 'pix.tlv.62', message: 'Additional data' }),
  '63': translate({ id: 'pix.tlv.63', message: 'CRC-16' }),
});

interface Field {
  id: string;
  length: string;
  value: string;
  name: string;
}

/**
 * Walk the payload as TLV: two digits of id, two of length, then that many
 * characters of value. Returns what it managed to read, so a malformed tail
 * still shows the fields before it rather than rendering nothing.
 */
function parseTlv(payload: string): Field[] {
  const names = fieldNames();
  const unknown = translate({ id: 'pix.tlv.unknown', message: 'Unknown field' });
  const fields: Field[] = [];
  let i = 0;

  while (i + 4 <= payload.length) {
    const id = payload.slice(i, i + 2);
    const lengthDigits = payload.slice(i + 2, i + 4);
    const length = Number(lengthDigits);
    if (Number.isNaN(length)) break;

    const value = payload.slice(i + 4, i + 4 + length);
    fields.push({ id, length: lengthDigits, value, name: names[id] ?? unknown });
    i += 4 + length;
  }

  return fields;
}

function Playground() {
  const [pixKey, setPixKey] = useState('bloom@example.com');
  const [merchantName, setMerchantName] = useState('Bloom Cosméticos');
  const [merchantCity, setMerchantCity] = useState('São Paulo');
  const [amount, setAmount] = useState('149.90');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!pixKey.trim()) {
      return {
        error: translate({
          id: 'pix.error.noKey',
          message: 'A Pix key is required — buildPixPayload throws without one.',
        }),
      };
    }

    try {
      const parsed = Number(amount);
      const payload = buildPixPayload({
        pixKey: pixKey.trim(),
        merchantName,
        merchantCity,
        amount: Number.isFinite(parsed) && parsed > 0 ? parsed : undefined,
        txid: 'DOCS-DEMO',
      });

      // Re-derive the checksum over everything but the last four characters,
      // which is exactly how a bank app validates the code it just scanned.
      const body = payload.slice(0, -4);
      const declared = payload.slice(-4);

      return {
        payload,
        fields: parseTlv(payload),
        crcValid: pixCrc16(body) === declared,
      };
    } catch (err) {
      return {
        error:
          err instanceof Error
            ? err.message
            : translate({ id: 'pix.error.generic', message: 'Could not build the payload' }),
      };
    }
  }, [pixKey, merchantName, merchantCity, amount]);

  const copy = () => {
    if (!('payload' in result) || !result.payload) return;
    navigator.clipboard?.writeText(result.payload).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    });
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.inputs}>
        <label className={styles.field}>
          <span>{translate({ id: 'pix.field.key', message: 'Pix key' })}</span>
          <input value={pixKey} onChange={(e) => setPixKey(e.target.value)} />
        </label>
        <label className={styles.field}>
          <span>{translate({ id: 'pix.field.name', message: 'Beneficiary name' })}</span>
          <input value={merchantName} onChange={(e) => setMerchantName(e.target.value)} />
        </label>
        <label className={styles.field}>
          <span>{translate({ id: 'pix.field.city', message: 'City' })}</span>
          <input value={merchantCity} onChange={(e) => setMerchantCity(e.target.value)} />
        </label>
        <label className={styles.field}>
          <span>{translate({ id: 'pix.field.amount', message: 'Amount (BRL)' })}</span>
          <input
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={translate({ id: 'pix.field.amountHint', message: 'empty = payer decides' })}
          />
        </label>
      </div>

      {'error' in result ? (
        <p className={styles.error}>{result.error}</p>
      ) : (
        <>
          <div className={styles.payloadBar}>
            <span className={result.crcValid ? styles.badgeOk : styles.badgeBad}>
              {result.crcValid ? translate({ id: 'pix.crc.valid', message: 'CRC-16 valid' }) : translate({ id: 'pix.crc.invalid', message: 'CRC-16 mismatch' })}
            </span>
            <button type="button" className={styles.copy} onClick={copy}>
              {copied ? translate({ id: 'pix.copy.done', message: 'Copied' }) : translate({ id: 'pix.copy.action', message: 'Copy BR Code' })}
            </button>
          </div>

          <pre className={styles.payload}>
            <code>{result.payload}</code>
          </pre>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>{translate({ id: 'pix.table.id', message: 'Id' })}</th>
                <th>{translate({ id: 'pix.table.len', message: 'Len' })}</th>
                <th>{translate({ id: 'pix.table.field', message: 'Field' })}</th>
                <th>{translate({ id: 'pix.table.value', message: 'Value' })}</th>
              </tr>
            </thead>
            <tbody>
              {result.fields.map((field, index) => (
                <tr key={`${field.id}-${index}`}>
                  <td><code>{field.id}</code></td>
                  <td><code>{field.length}</code></td>
                  <td>{field.name}</td>
                  <td className={styles.value}><code>{field.value}</code></td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className={styles.note}>
            {translate({
              id: 'pix.note',
              message:
                "Notice the accents and lower case disappear from the name and city, and that anything longer than the spec's limit is truncated — 25 characters for the name, 15 for the city.",
            })}
          </p>
        </>
      )}
    </div>
  );
}

/**
 * Runs the real generator from the published package, not a reimplementation,
 * so what the page shows is what a store would produce. Browser-only because it
 * pulls in the core bundle.
 */
export default function PixPlayground() {
  return (
    <BrowserOnly
      fallback={<p>{translate({ id: 'pix.loading', message: 'Loading the Pix generator…' })}</p>}
    >
      {() => <Playground />}
    </BrowserOnly>
  );
}
