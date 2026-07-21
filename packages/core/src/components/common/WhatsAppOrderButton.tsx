import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useSiteConfig } from '@/contexts/SiteConfigContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatMoney } from '@/lib/currency';
import { ShippingInfo } from '@/types';

interface Props {
  shipping?: ShippingInfo | null;
  shippingCost?: number;
  finalTotal?: number;
  variant?: 'default' | 'outline';
  fullWidth?: boolean;
}

const digitsOnly = (s: string) => s.replace(/\D/g, '');

const WhatsAppOrderButton = ({ shipping, shippingCost = 0, finalTotal, variant = 'outline', fullWidth = true }: Props) => {
  const { items, total } = useCart();
  const { config } = useSiteConfig();
  const { language } = useLanguage();
  const isPt = language === 'pt';
  const brand = config.companyName || 'Store';

  if (!config.whatsappPhone || items.length === 0) return null;

  const phone = digitsOnly(config.whatsappPhone);
  const fmt = (n: number) => formatMoney(n, config.currency);

  const lines: string[] = [];
  lines.push(isPt ? `🛒 *Novo pedido — ${brand}*` : `🛒 *New order — ${brand}*`);
  lines.push('');
  items.forEach((i) => {
    lines.push(`• ${i.product.name} × ${i.quantity} — ${fmt(i.product.price * i.quantity)}`);
  });
  lines.push('');
  lines.push(`${isPt ? 'Subtotal' : 'Subtotal'}: ${fmt(total)}`);
  if (shippingCost) lines.push(`${isPt ? 'Frete' : 'Shipping'}: ${fmt(shippingCost)}`);
  if (finalTotal !== undefined) lines.push(`*${isPt ? 'Total' : 'Total'}: ${fmt(finalTotal)}*`);
  if (shipping) {
    lines.push('');
    lines.push(isPt ? '*Entrega:*' : '*Delivery:*');
    lines.push(`${shipping.firstName} ${shipping.lastName}`);
    lines.push(`${shipping.address}, ${shipping.city} ${shipping.state} ${shipping.zip}`);
    lines.push(shipping.country);
    lines.push(`✉ ${shipping.email}`);
  }

  const href = `https://wa.me/${phone}?text=${encodeURIComponent(lines.join('\n'))}`;

  return (
    <a href={href} target="_blank" rel="noreferrer" className={fullWidth ? 'block w-full' : 'inline-block'}>
      <Button
        type="button"
        variant={variant}
        className={`gap-2 ${fullWidth ? 'w-full' : ''} border-[#25D366] bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20 dark:text-[#25D366]`}
      >
        <MessageCircle className="h-4 w-4" />
        {isPt ? 'Pedir pelo WhatsApp' : 'Order via WhatsApp'}
      </Button>
    </a>
  );
};

export default WhatsAppOrderButton;
