import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useSiteConfig } from '../contexts/SiteConfigContext';
import { useCatalogData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { trackEvent } from './useCatalogAnalytics';
import { ShippingInfo } from '../types';
import {
  PaymentMethod,
  CheckoutPayload,
  PaymentResult,
  PaymentGatewayAdapter,
} from '../lib/checkoutTypes';
import {
  whatsappGateway,
  pixGateway,
  stripeGateway,
  mercadopagoGateway,
} from '../lib/checkoutAdapters';

export interface UseCheckoutOptions {
  /** Custom gateway adapters per payment method */
  adapters?: Partial<Record<PaymentMethod, PaymentGatewayAdapter>>;
  /** Redirect automatically to Stripe or MercadoPago URL on success */
  autoRedirect?: boolean;
}

export const useCheckout = (options?: UseCheckoutOptions) => {
  const { items, subtotal, discount, shippingCost, total, clearCart } = useCart();
  const { config } = useSiteConfig();
  const dataProvider = useCatalogData();
  const { language, t } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processCheckout = async (
    shippingInfo: ShippingInfo,
    paymentMethod: PaymentMethod = 'whatsapp',
    notes?: string
  ): Promise<PaymentResult> => {
    setLoading(true);
    setError(null);

    const payload: CheckoutPayload = {
      items,
      subtotal,
      discount,
      shippingCost,
      total,
      shippingInfo,
      paymentMethod,
      notes,
    };

    // Trigger e-commerce begin_checkout analytics event
    trackEvent('begin_checkout', {
      value: total,
      currency: config.currency || 'BRL',
      items: items.map((item) => ({
        item_id: item.product.id,
        item_name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      })),
    });

    try {
      let adapter: PaymentGatewayAdapter;

      if (options?.adapters?.[paymentMethod]) {
        adapter = options.adapters[paymentMethod]!;
      } else {
        // The store's own currency and language, not the payload's: every
        // amount in these messages is priced by the store, so it has to be
        // written the way the store writes money.
        const whatsapp = () =>
          whatsappGateway({
            phone: config.whatsappPhone,
            currency: config.currency,
            language,
          });

        switch (paymentMethod) {
          case 'whatsapp':
            adapter = whatsapp();
            break;
          case 'pix':
            adapter = pixGateway({
              pixKey: config.pixKey,
              merchantName: config.companyName,
              merchantCity: config.pixMerchantCity,
              language,
            });
            break;
          case 'stripe':
            adapter = stripeGateway('/api/checkout/stripe', { language });
            break;
          case 'mercadopago':
            adapter = mercadopagoGateway('/api/checkout/mercadopago', { language });
            break;
          default:
            adapter = whatsapp();
        }
      }

      const res = await adapter(payload);

      if (!res.success) {
        throw new Error(res.error || t.checkoutFailed);
      }

      // Record order via active Headless DataProvider if supported
      if (dataProvider.createOrder) {
        await dataProvider.createOrder({
          items,
          shipping: shippingInfo,
          total,
        });
      }

      // Trigger purchase analytics event
      trackEvent('purchase', {
        transaction_id: res.orderId,
        value: total,
        currency: config.currency || 'BRL',
        items: items.map((item) => ({
          item_id: item.product.id,
          item_name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
        })),
      });

      setResult(res);

      if (res.whatsappUrl) {
        if (typeof window !== 'undefined') {
          window.open(res.whatsappUrl, '_blank');
        }
      } else if (options?.autoRedirect && res.paymentUrl) {
        if (typeof window !== 'undefined') {
          window.location.href = res.paymentUrl;
        }
      }

      clearCart();
      return res;
    } catch (err: any) {
      const errMsg = err.message || t.checkoutUnexpectedError;
      setError(errMsg);
      const failedResult: PaymentResult = { success: false, error: errMsg };
      setResult(failedResult);
      return failedResult;
    } finally {
      setLoading(false);
    }
  };

  return {
    processCheckout,
    loading,
    result,
    error,
  };
};
