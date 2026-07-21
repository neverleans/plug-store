import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Minus, Plus, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { safeImage, onImgError } from '@/lib/productImage';
import { useMoney } from '@/lib/currency';


interface Props {
  trigger: React.ReactNode;
}

const FREE_SHIPPING_THRESHOLD = 100;

const MiniCart = ({ trigger }: Props) => {
  const { items, updateQuantity, removeItem, total } = useCart();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const money = useMoney();
  const [open, setOpen] = useState(false);

  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle style={{ fontFamily: theme.fonts.heading }}>
            {t.miniCartTitle} ({items.length})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <ShoppingCart className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">{t.emptyCart}</p>
            <Link to="/products" onClick={() => setOpen(false)}>
              <Button variant="outline" size="sm">{t.browseProducts}</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="border-b bg-muted/40 px-5 py-3">
              {remaining > 0 ? (
                <>
                  <p className="mb-1.5 text-xs">
                    {t.freeShippingProgress} <span className="font-semibold">{money(remaining)}</span> {t.forFreeShipping}

                  </p>
                  <Progress value={pct} className="h-1.5" />
                </>
              ) : (
                <p className="text-xs font-medium text-primary">{t.freeShippingUnlocked}</p>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="space-y-4">
                {items.map((it) => (
                  <li key={it.product.id} className="flex gap-3">
                    <Link to={`/products/${it.product.id}`} onClick={() => setOpen(false)} className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
                      <img src={safeImage(it.product.images[0])} onError={onImgError} alt={it.product.name} className="h-full w-full object-cover" />
                    </Link>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <Link to={`/products/${it.product.id}`} onClick={() => setOpen(false)} className="line-clamp-1 text-sm font-medium hover:text-primary">
                          {it.product.name}
                        </Link>
                        <p className="text-xs text-muted-foreground">{money(it.product.price)}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center rounded-md border">
                          <button aria-label="Decrease" onClick={() => updateQuantity(it.product.id, it.quantity - 1)} className="px-1.5 py-0.5 hover:bg-muted"><Minus className="h-3 w-3" /></button>
                          <span className="min-w-[1.75rem] text-center text-xs">{it.quantity}</span>
                          <button aria-label="Increase" onClick={() => updateQuantity(it.product.id, it.quantity + 1)} className="px-1.5 py-0.5 hover:bg-muted"><Plus className="h-3 w-3" /></button>
                        </div>
                        <button aria-label="Remove" onClick={() => removeItem(it.product.id)} className="text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <SheetFooter className="border-t bg-card px-5 py-4">
              <div className="w-full space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t.subtotal}</span>
                  <span className="text-base font-bold">{money(subtotal)}</span>

                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Link to="/cart" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full">{t.viewCart}</Button>
                  </Link>
                  <Link to="/checkout" onClick={() => setOpen(false)}>
                    <Button className="w-full gap-2">{t.goToCheckout} <ArrowRight className="h-4 w-4" /></Button>
                  </Link>
                </div>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default MiniCart;
