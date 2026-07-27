import { useMemo, useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { buildPixPayload, pixCrc16 } from '@neverleans-labs/plug-store-core';
import styles from './styles.module.css';

/** Human names for the EMV/BCB field ids PlugStore emits. */
const FIELD_NAMES: Record<string, string> = {
  '00': 'Payload format indicator',
  '01': 'Point of initiation',
  '26': 'Merchant account (Pix)',
  '52': 'Merchant category code',
  '53': 'Transaction currency',
  '54': 'Transaction amount',
  '58': 'Country code',
  '59': 'Beneficiary name',
  '60': 'Beneficiary city',
  '62': 'Additional data',
  '63': 'CRC-16',
};

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
  const fields: Field[] = [];
  let i = 0;

  while (i + 4 <= payload.length) {
    const id = payload.slice(i, i + 2);
    const lengthDigits = payload.slice(i + 2, i + 4);
    const length = Number(lengthDigits);
    if (Number.isNaN(length)) break;

    const value = payload.slice(i + 4, i + 4 + length);
    fields.push({ id, length: lengthDigits, value, name: FIELD_NAMES[id] ?? 'Unknown field' });
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
      return { error: 'A Pix key is required — buildPixPayload throws without one.' as const };
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
      return { error: err instanceof Error ? err.message : 'Could not build the payload' };
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
          <span>Pix key</span>
          <input value={pixKey} onChange={(e) => setPixKey(e.target.value)} />
        </label>
        <label className={styles.field}>
          <span>Beneficiary name</span>
          <input value={merchantName} onChange={(e) => setMerchantName(e.target.value)} />
        </label>
        <label className={styles.field}>
          <span>City</span>
          <input value={merchantCity} onChange={(e) => setMerchantCity(e.target.value)} />
        </label>
        <label className={styles.field}>
          <span>Amount (BRL)</span>
          <input
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="empty = payer decides"
          />
        </label>
      </div>

      {'error' in result ? (
        <p className={styles.error}>{result.error}</p>
      ) : (
        <>
          <div className={styles.payloadBar}>
            <span className={result.crcValid ? styles.badgeOk : styles.badgeBad}>
              {result.crcValid ? 'CRC-16 valid' : 'CRC-16 mismatch'}
            </span>
            <button type="button" className={styles.copy} onClick={copy}>
              {copied ? 'Copied' : 'Copy BR Code'}
            </button>
          </div>

          <pre className={styles.payload}>
            <code>{result.payload}</code>
          </pre>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Id</th>
                <th>Len</th>
                <th>Field</th>
                <th>Value</th>
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
            Notice the accents and lower case disappear from the name and city, and that
            anything longer than the spec's limit is truncated — 25 characters for the
            name, 15 for the city.
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
  return <BrowserOnly fallback={<p>Loading the Pix generator…</p>}>{() => <Playground />}</BrowserOnly>;
}
