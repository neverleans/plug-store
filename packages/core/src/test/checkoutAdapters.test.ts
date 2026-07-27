import { describe, it, expect } from 'vitest';
import { whatsappGateway, pixGateway } from '../lib/checkoutAdapters';
import type { CheckoutPayload } from '../lib/checkoutTypes';
import type { Product, ShippingInfo } from '../types';

/**
 * The WhatsApp message is the single most customer-visible string this package
 * produces: the buyer reads it before sending, and the store owner reads it on
 * arrival. It used to format every amount with `toFixed(2)`, so a Brazilian
 * store told its customers "R$ 12.90" — and hardcoded "R$" even when the store
 * priced in dollars.
 */

const product = (name: string, price: number): Product => ({
  id: `p-${name}`,
  name,
  description: '',
  price,
  images: [],
  category: 'bakery',
  rating: 5,
  reviewCount: 1,
  tags: [],
  inStock: true,
  industry: 'bakery',
});

const shipping: ShippingInfo = {
  firstName: 'Ana',
  lastName: 'Souza',
  email: 'ana@example.com',
  address: 'Rua das Flores 210',
  city: 'São Paulo',
  state: 'SP',
  zip: '01310-000',
  country: 'BR',
};

const payload = (over: Partial<CheckoutPayload> = {}): CheckoutPayload => ({
  items: [{ product: product('Pao integral', 12.9), quantity: 2 }],
  subtotal: 25.8,
  discount: 0,
  shippingCost: 8,
  total: 33.8,
  shippingInfo: shipping,
  paymentMethod: 'whatsapp',
  ...over,
});

/**
 * Intl separates the currency symbol with U+00A0, not a plain space, so the
 * assertions below normalise it. Comparing against a literal " " would fail for
 * a message that is in fact correct.
 */
async function messageOf(adapter: ReturnType<typeof whatsappGateway>): Promise<string> {
  const result = await adapter(payload());
  expect(result.success).toBe(true);
  const url = new URL(result.whatsappUrl!);
  return url.searchParams.get('text')!.replace(/\u00A0/g, ' ');
}

describe('whatsappGateway money formatting', () => {
  it('writes BRL the way Brazil writes it, with a comma', async () => {
    const text = await messageOf(whatsappGateway({ phone: '5511999999999', currency: 'BRL' }));

    expect(text).toContain('R$ 12,90');
    expect(text).toContain('R$ 8,00');
    expect(text).toContain('R$ 33,80');
    // The old bug, stated as an assertion so it cannot come back.
    expect(text).not.toContain('12.90');
  });

  it('uses the store currency instead of a hardcoded R$', async () => {
    const text = await messageOf(whatsappGateway({ phone: '15551234567', currency: 'USD' }));

    expect(text).toContain('$12.90');
    expect(text).toContain('$33.80');
    expect(text).not.toContain('R$');
  });

  it('defaults to BRL when no currency is given', async () => {
    const text = await messageOf(whatsappGateway({ phone: '5511999999999' }));

    expect(text).toContain('R$ 12,90');
  });

  it('still accepts a bare phone number', async () => {
    const text = await messageOf(whatsappGateway('5511999999999'));

    expect(text).toContain('R$ 12,90');
  });
});

describe('whatsappGateway language', () => {
  it('writes the order in Portuguese by default', async () => {
    const text = await messageOf(whatsappGateway({ phone: '5511999999999' }));

    expect(text).toContain('Novo Pedido');
    expect(text).toContain('Cliente:');
    expect(text).toContain('Itens do Pedido');
    expect(text).toContain('Frete:');
  });

  it('writes the order in English for an English store', async () => {
    const text = await messageOf(
      whatsappGateway({ phone: '15551234567', currency: 'USD', language: 'en' }),
    );

    expect(text).toContain('New Order');
    expect(text).toContain('Customer:');
    expect(text).toContain('Order Items');
    expect(text).toContain('Shipping:');
    expect(text).not.toContain('Pedido');
  });

  it('reports a missing phone number in the store language', async () => {
    const pt = await whatsappGateway({})(payload());
    const en = await whatsappGateway({ language: 'en' })(payload());

    expect(pt.success).toBe(false);
    expect(pt.error).toBe('Telefone do WhatsApp não configurado.');
    expect(en.error).toBe('WhatsApp number is not configured.');
  });

  it('strips non-digits from the phone number before building the link', async () => {
    const result = await whatsappGateway({ phone: '+55 (11) 99999-9999' })(payload());

    expect(result.whatsappUrl).toContain('https://wa.me/5511999999999?');
  });
});

describe('pixGateway', () => {
  it('reports a missing key in the store language', async () => {
    const pt = await pixGateway({})(payload());
    const en = await pixGateway({ language: 'en' })(payload());

    expect(pt.error).toBe('Chave Pix não configurada. Defina pixKey na configuração da loja.');
    expect(en.error).toBe('Pix key is not configured. Set pixKey in the store configuration.');
  });
});
