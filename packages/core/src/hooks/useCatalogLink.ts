import { useSiteConfig } from '@/contexts/SiteConfigContext';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/types';

export const useCatalogLink = () => {
  const { config } = useSiteConfig();
  const { items, total } = useCart();

  const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return '';
  };

  /** Returns absolute URL for public shared catalog */
  const getPublicCatalogUrl = () => {
    const slug = config.publicSlug || 'catalog';
    return `${getBaseUrl()}/c/${slug}`;
  };

  /** Returns absolute link for a specific category */
  const getCategoryUrl = (categorySlug: string) => {
    return `${getBaseUrl()}/products?category=${encodeURIComponent(categorySlug)}`;
  };

  /** Returns absolute link for a product */
  const getProductUrl = (product: Product) => {
    return `${getBaseUrl()}/products/${product.id}`;
  };

  /** Generates direct pre-filled WhatsApp link with cart details */
  const getWhatsAppCheckoutUrl = () => {
    if (!config.whatsappPhone) return '#';
    const phone = config.whatsappPhone.replace(/\D/g, '');
    if (!phone) return '#';

    let text = `👋 *${config.companyName || 'Store'}* — *Novo Pedido*\n\n`;
    items.forEach((item) => {
      text += `• ${item.quantity}x *${item.product.name}* (R$ ${item.product.price.toFixed(2)})\n`;
    });
    text += `\n💰 *Total:* R$ ${total.toFixed(2)}`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  return {
    getPublicCatalogUrl,
    getCategoryUrl,
    getProductUrl,
    getWhatsAppCheckoutUrl,
  };
};
