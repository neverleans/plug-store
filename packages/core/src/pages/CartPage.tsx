import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Tag, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteConfig } from '@/contexts/SiteConfigContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { panelClasses } from '@/lib/cardStyle';
import { safeImage, onImgError } from '@/lib/productImage';
import { useMoney } from '@/lib/currency';
import WhatsAppOrderButton from '@/components/common/WhatsAppOrderButton';

const FREE_SHIPPING = 100;


const CartPage = () => {
  const { items, removeItem, updateQuantity, itemCount, discountCode, setDiscountCode, clearCart } = useCart();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { config } = useSiteConfig();
  const money = useMoney();
  const [zip, setZip] = useState('');
  const [zipShipping, setZipShipping] = useState<number | null>(null);

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-20">
        <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground/30" />
        <h1 className="mb-2 text-2xl font-bold" style={{ fontFamily: theme.fonts.heading }}>{t.yourCartIsEmpty}</h1>
        <p className="mb-6 text-muted-foreground">{t.addProductsToStart}</p>
        <Link to="/products"><Button>{t.browseProducts}</Button></Link>
      </div>
    );
  }

  const coupons = config.coupons || [];
  const couponsByCode = Object.fromEntries(coupons.map((c) => [c.code.toUpperCase(), c]));

  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const coupon = couponsByCode[discountCode.toUpperCase()];
  const couponDiscount = coupon
    ? coupon.type === 'percent' ? subtotal * (coupon.value / 100) : (coupon.value > 0 ? Math.min(coupon.value, subtotal) : 0)
    : 0;
  const baseShipping = subtotal > FREE_SHIPPING ? 0 : (zipShipping ?? 9.99);
  const finalShipping = coupon && /free.*ship/i.test(coupon.label) ? 0 : baseShipping;
  const total = subtotal - couponDiscount + finalShipping;
  const freeShipPct = Math.min(100, (subtotal / FREE_SHIPPING) * 100);
  const remaining = Math.max(0, FREE_SHIPPING - subtotal);

  const panel = panelClasses(theme.cardStyle);

  const calculateZip = () => {
    if (!zip.trim()) return;
    const num = parseInt(zip.replace(/\D/g, '').slice(0, 5) || '0', 10);
    const cost = 5 + (num % 15);
    setZipShipping(cost);
    toast.success(`${t.estimatedShipping}: ${money(cost)}`);
  };

  const applyCoupon = () => {
    if (!discountCode.trim()) return;
    if (couponsByCode[discountCode.toUpperCase()]) {
      setDiscountCode(discountCode.toUpperCase());
      toast.success(`Coupon ${discountCode.toUpperCase()} applied`);
    } else {
      toast.error('Invalid coupon');
    }
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold" style={{ fontFamily: theme.fonts.heading }}>{t.shoppingCart} ({itemCount})</h1>

      <div className={`mb-6 p-4 ${panel}`}>
        {remaining > 0 ? (
          <p className="mb-2 text-sm">{t.freeShippingProgress} <span className="font-semibold">{money(remaining)}</span> {t.forFreeShipping}</p>
        ) : (
          <p className="mb-2 text-sm font-medium text-primary">{t.freeShippingUnlocked}</p>
        )}
        <Progress value={freeShipPct} className="h-1.5" />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.product.id} className={`flex gap-4 p-4 ${panel}`}>
              <Link to={`/products/${item.product.id}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-md bg-muted">
                <img src={safeImage(item.product.images[0])} onError={onImgError} alt={item.product.name} className="h-full w-full object-cover" />
              </Link>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link to={`/products/${item.product.id}`} className="font-semibold hover:text-primary">{item.product.name}</Link>
                  {item.selectedVariants && Object.entries(item.selectedVariants).map(([k, v]) => (
                    <span key={k} className="ml-2 text-xs text-muted-foreground">{k}: {v}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center rounded-md border">
                    <button aria-label="Decrease" onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="px-2 py-1 hover:bg-muted"><Minus className="h-3 w-3" /></button>
                    <span className="min-w-[2rem] text-center text-sm">{item.quantity}</span>
                    <button aria-label="Increase" onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="px-2 py-1 hover:bg-muted"><Plus className="h-3 w-3" /></button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{money(item.product.price * item.quantity)}</span>

                    <button aria-label="Remove" onClick={() => removeItem(item.product.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <Button variant="ghost" size="sm" onClick={clearCart} className="text-muted-foreground">{t.clearCart}</Button>
        </div>

        <div className="space-y-4">
          <div className={`p-6 ${panel}`}>
            <h2 className="mb-4 text-lg font-bold" style={{ fontFamily: theme.fonts.heading }}>{t.orderSummary}</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>{t.subtotal}</span><span>{money(subtotal)}</span></div>
              <div className="flex justify-between"><span>{t.shipping}</span><span>{finalShipping === 0 ? t.free : money(finalShipping)}</span></div>
              {couponDiscount > 0 && <div className="flex justify-between text-primary"><span>{t.discount} ({discountCode})</span><span>-{money(couponDiscount)}</span></div>}
            </div>
            <div className="my-4 border-t pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>{t.total}</span>
                <span>{money(total)}</span>
              </div>
            </div>
            <div className="mb-3 flex gap-2">
              <Input placeholder={t.discountCode} value={discountCode} onChange={e => setDiscountCode(e.target.value)} />
              <Button variant="outline" size="sm" onClick={applyCoupon}>{t.apply}</Button>
            </div>
            {coupons.length > 0 && (
              <div className="mb-4 rounded-md bg-muted/40 p-3">
                <p className="mb-1.5 flex items-center gap-1 text-xs font-semibold uppercase text-muted-foreground"><Tag className="h-3 w-3" /> {t.availableCoupons}</p>
                <div className="flex flex-wrap gap-1.5">
                  {coupons.map((c) => (
                    <button key={c.code} onClick={() => { setDiscountCode(c.code); toast.success(`Coupon ${c.code} applied`); }}
                      className="rounded border bg-background px-2 py-1 text-[11px] font-medium hover:border-primary">
                      <span className="font-semibold">{c.code}</span> · {c.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <Link to="/checkout">
              <Button className="w-full gap-2">{t.checkout} <ArrowRight className="h-4 w-4" /></Button>
            </Link>
            <div className="mt-2">
              <WhatsAppOrderButton finalTotal={total} shippingCost={finalShipping} />
            </div>
          </div>


          <div className={`p-6 ${panel}`}>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold" style={{ fontFamily: theme.fonts.heading }}><Truck className="h-4 w-4" />{t.shippingCalculator}</h3>
            <div className="flex gap-2">
              <Input placeholder={t.enterZip} value={zip} onChange={e => setZip(e.target.value)} />
              <Button variant="outline" size="sm" onClick={calculateZip}>{t.calculate}</Button>
            </div>
            {zipShipping !== null && (
              <p className="mt-2 text-sm">{t.estimatedShipping}: <span className="font-semibold">{money(zipShipping)}</span></p>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
