import { PaymentGatewayAdapter, CheckoutPayload, PaymentResult } from './checkoutTypes';

/**
 * whatsappGateway
 * 
 * Generates direct pre-filled WhatsApp checkout message URL
 */
export const whatsappGateway = (whatsappPhone?: string): PaymentGatewayAdapter => {
  return async (payload: CheckoutPayload): Promise<PaymentResult> => {
    const phone = whatsappPhone || '';
    if (!phone) {
      return { success: false, error: 'Telefone do WhatsApp não configurado.' };
    }

    const orderId = 'ORD-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    let text = `👋 *Novo Pedido #${orderId}*\n\n`;
    text += `👤 *Cliente:* ${payload.shippingInfo.firstName} ${payload.shippingInfo.lastName}\n`;
    text += `📍 *Endereço:* ${payload.shippingInfo.address}, ${payload.shippingInfo.city} - ${payload.shippingInfo.state}\n\n`;
    text += `📦 *Itens do Pedido:*\n`;

    payload.items.forEach((item) => {
      text += `• ${item.quantity}x *${item.product.name}* (R$ ${item.product.price.toFixed(2)})\n`;
    });

    if (payload.discount > 0) {
      text += `\n🏷️ *Desconto:* R$ ${payload.discount.toFixed(2)}`;
    }
    if (payload.shippingCost > 0) {
      text += `\n🚚 *Frete:* R$ ${payload.shippingCost.toFixed(2)}`;
    }
    text += `\n💰 *TOTAL:* R$ ${payload.total.toFixed(2)}`;

    const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
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
 * Simulates instant Pix QR Code & Copy-Paste Code generation for Brazilian e-commerce
 */
export const pixGateway = (pixKey?: string): PaymentGatewayAdapter => {
  return async (payload: CheckoutPayload): Promise<PaymentResult> => {
    const orderId = 'PIX-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    const key = pixKey || '00020126580014br.gov.bcb.pix';
    
    // Copy-paste PIX mock BRCode
    const pixCode = `${key}.order.${orderId}.total.${payload.total.toFixed(2)}`;
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
  options?: { headers?: Record<string, string> }
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
        error: err.message || 'Falha ao processar pagamento via Stripe',
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
  options?: { headers?: Record<string, string> }
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
        error: err.message || 'Falha ao gerar preference no Mercado Pago',
      };
    }
  };
};
