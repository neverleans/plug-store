import { PaymentGatewayAdapter, CheckoutPayload, PaymentResult } from './checkoutTypes';
import { buildPixPayload } from './pix';
import { formatMoney } from './currency';
import type { CurrencyCode } from '../contexts/SiteConfigContext';
import { pt } from '../i18n/pt';
import { en } from '../i18n/en';
import type { Language } from '../i18n';

/**
 * Strings for the messages an adapter generates. Adapters are exported for
 * headless use, so they resolve their own copy from a language code instead of
 * requiring a React context to be threaded in.
 */
const strings = (language: Language = 'pt') => (language === 'en' ? en : pt);

export interface PixGatewayOptions {
  /** Merchant Pix key. Required to produce a scannable code. */
  pixKey?: string;
  /** Beneficiary name shown to the payer (max 25 chars). */
  merchantName?: string;
  /** Merchant city in the Pix payload (max 15 chars). */
  merchantCity?: string;
  /** Language of the error message when the key is missing. Defaults to `pt`. */
  language?: Language;
}

export interface WhatsappGatewayOptions {
  /** Store's WhatsApp number. Non-digits are stripped. */
  phone?: string;
  /**
   * Store currency, so amounts are formatted the way the store prices them.
   * Defaults to `BRL` — the currency this adapter exists for.
   */
  currency?: CurrencyCode;
  /** Language of the generated order message. Defaults to `pt`. */
  language?: Language;
}

/**
 * whatsappGateway
 *
 * Turns the order into a pre-filled wa.me message the customer sends to the
 * store. Amounts go through formatMoney rather than toFixed, because a
 * Brazilian store writing "R$ 12.90" to its own customers is wrong in the one
 * string this adapter exists to produce.
 *
 * Accepts either a bare phone number (backwards compatible) or an options object.
 */
export const whatsappGateway = (
  phoneOrOptions?: string | WhatsappGatewayOptions,
): PaymentGatewayAdapter => {
  const options: WhatsappGatewayOptions =
    typeof phoneOrOptions === 'string' ? { phone: phoneOrOptions } : phoneOrOptions || {};
  const t = strings(options.language);
  const money = (amount: number) => formatMoney(amount, options.currency ?? 'BRL');

  return async (payload: CheckoutPayload): Promise<PaymentResult> => {
    const phone = (options.phone || '').replace(/\D/g, '');
    if (!phone) {
      return { success: false, error: t.waNoPhone };
    }

    const orderId = 'ORD-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    let text = `👋 *${t.waNewOrder} #${orderId}*\n\n`;
    text += `👤 *${t.waCustomer}:* ${payload.shippingInfo.firstName} ${payload.shippingInfo.lastName}\n`;
    text += `📍 *${t.address}:* ${payload.shippingInfo.address}, ${payload.shippingInfo.city} - ${payload.shippingInfo.state}\n\n`;
    text += `📦 *${t.waOrderItems}:*\n`;

    payload.items.forEach((item) => {
      text += `• ${item.quantity}x *${item.product.name}* (${money(item.product.price)})\n`;
    });

    if (payload.discount > 0) {
      text += `\n🏷️ *${t.discount}:* ${money(payload.discount)}`;
    }
    if (payload.shippingCost > 0) {
      text += `\n🚚 *${t.shipping}:* ${money(payload.shippingCost)}`;
    }
    text += `\n💰 *${t.total.toUpperCase()}:* ${money(payload.total)}`;

    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    return {
      success: true,
      orderId,
      whatsappUrl,
    };
  };
};

/**
 * pixGateway
 *
 * Generates a real static Pix "Copia e Cola" BR Code (EMV/BCB payload) for the
 * order total. The resulting code is scannable in any Brazilian banking app and
 * pays the merchant's key directly.
 *
 * This is the free, static tier: it creates a valid payment request but does not
 * confirm settlement. Reconciling paid vs. unpaid — the dynamic Pix flow with a
 * PSP webhook — is a separate concern; supply your own adapter via useCheckout's
 * `adapters` option to handle it.
 *
 * Accepts either a bare Pix key (backwards compatible) or an options object.
 */
export const pixGateway = (
  keyOrOptions?: string | PixGatewayOptions,
): PaymentGatewayAdapter => {
  const options: PixGatewayOptions =
    typeof keyOrOptions === 'string' ? { pixKey: keyOrOptions } : keyOrOptions || {};

  return async (payload: CheckoutPayload): Promise<PaymentResult> => {
    if (!options.pixKey) {
      return { success: false, error: strings(options.language).waNoPixKey };
    }

    const orderId = 'PIX-' + Math.random().toString(36).slice(2, 8).toUpperCase();

    const pixCode = buildPixPayload({
      pixKey: options.pixKey,
      merchantName: options.merchantName || 'Recebedor',
      merchantCity: options.merchantCity || 'Brasil',
      amount: payload.total,
      txid: orderId,
    });

    const pixQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pixCode)}`;

    return {
      success: true,
      orderId,
      pixCode,
      pixQrCodeUrl,
    };
  };
};

/**
 * stripeGateway
 * 
 * Adapter for Stripe Checkout session redirection
 */
export const stripeGateway = (
  checkoutEndpointUrl: string,
  options?: { headers?: Record<string, string>; language?: Language }
): PaymentGatewayAdapter => {
  return async (payload: CheckoutPayload): Promise<PaymentResult> => {
    try {
      const res = await fetch(checkoutEndpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Stripe Gateway HTTP Error [${res.status}]`);
      }

      const data = await res.json();
      return {
        success: true,
        orderId: data.orderId || data.id,
        paymentUrl: data.url || data.paymentUrl,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || strings(options?.language).stripeFailed,
      };
    }
  };
};

/**
 * mercadopagoGateway
 * 
 * Adapter for Mercado Pago Checkout Pro & Preference creation
 */
export const mercadopagoGateway = (
  preferenceEndpointUrl: string,
  options?: { headers?: Record<string, string>; language?: Language }
): PaymentGatewayAdapter => {
  return async (payload: CheckoutPayload): Promise<PaymentResult> => {
    try {
      const res = await fetch(preferenceEndpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Mercado Pago Gateway HTTP Error [${res.status}]`);
      }

      const data = await res.json();
      return {
        success: true,
        orderId: data.orderId || data.id,
        paymentUrl: data.init_point || data.sandbox_init_point || data.paymentUrl,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || strings(options?.language).mercadopagoFailed,
      };
    }
  };
};
