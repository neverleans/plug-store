import { CartItem, ShippingInfo } from '../types';

export type PaymentMethod = 'whatsapp' | 'pix' | 'stripe' | 'mercadopago';

export interface CheckoutPayload {
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  shippingInfo: ShippingInfo;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface PaymentResult {
  success: boolean;
  orderId?: string;
  paymentUrl?: string; // Redirect URL for Stripe or MercadoPago
  pixCode?: string;     // Copy-paste Pix code
  pixQrCodeUrl?: string; // Pix QR Code image URL
  whatsappUrl?: string;  // Direct WhatsApp message link
  error?: string;
}

export type PaymentGatewayAdapter = (payload: CheckoutPayload) => Promise<PaymentResult>;
