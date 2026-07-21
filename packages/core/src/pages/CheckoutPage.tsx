import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAccount } from '@/contexts/AccountContext';
import { ShippingInfo } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { panelClasses } from '@/lib/cardStyle';
import { safeImage, onImgError } from '@/lib/productImage';
import { useMoney } from '@/lib/currency';
import WhatsAppOrderButton from '@/components/common/WhatsAppOrderButton';


const shippingSchema = z.object({
  firstName: z.string().trim().min(1).max(50),
  lastName: z.string().trim().min(1).max(50),
  email: z.string().trim().email().max(255),
  address: z.string().trim().min(3).max(120),
  city: z.string().trim().min(1).max(80),
  state: z.string().trim().min(1).max(80),
  zip: z.string().trim().min(3).max(12),
  country: z.string().trim().min(2).max(80),
});

const paymentSchema = z.object({
  cardNumber: z.string().trim().min(12).max(19),
  expiry: z.string().trim().regex(/^\d{2}\/\d{2}$/, 'MM/YY'),
  cvc: z.string().trim().min(3).max(4),
  nameOnCard: z.string().trim().min(2).max(80),
});

type Step = 1 | 2 | 3 | 4;

const CheckoutPage = () => {
  const { items, total, discount, clearCart } = useCart();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { addOrder, saveAddress } = useAccount();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [shipping, setShipping] = useState<ShippingInfo | null>(null);
  const money = useMoney();

  const panel = panelClasses(theme.cardStyle);
  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const shippingCost = subtotal > 100 ? 0 : 9.99;
  const finalTotal = total + shippingCost;


  useEffect(() => {
    if (items.length === 0) navigate('/cart');
  }, [items.length, navigate]);

  const shipForm = useForm<ShippingInfo>({ resolver: zodResolver(shippingSchema) });
  const payForm = useForm({ resolver: zodResolver(paymentSchema) });

  const onSubmitShipping = (data: ShippingInfo) => {
    setShipping(data);
    saveAddress(data);
    setStep(2);
  };
  const onSubmitPayment = () => setStep(3);
  const onConfirm = () => {
    if (!shipping) return;
    const order = addOrder({ items, total: finalTotal, shipping });
    clearCart();
    toast.success(`Order ${order.id} placed`);
    navigate('/order-confirmation');
  };

  const labels = [t.shippingStep, t.paymentStep, t.reviewStep, t.confirmation];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold" style={{ fontFamily: theme.fonts.heading }}>{t.checkout}</h1>

      <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
        {labels.map((label, i) => {
          const n = (i + 1) as Step;
          const active = step >= n;
          return (
            <div key={label} className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                {step > n ? <Check className="h-4 w-4" /> : n}
              </div>
              <span className={`text-sm font-medium ${active ? '' : 'text-muted-foreground'}`}>{label}</span>
              {i < labels.length - 1 && <div className="mx-2 h-px w-8 bg-border" />}
            </div>
          );
        })}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {step === 1 && (
            <form onSubmit={shipForm.handleSubmit(onSubmitShipping)} className={`space-y-4 p-6 ${panel}`}>
              <h2 className="mb-4 text-lg font-bold" style={{ fontFamily: theme.fonts.heading }}>{t.shippingInfo}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">{t.firstName}</label>
                  <Input {...shipForm.register('firstName')} />
                  {shipForm.formState.errors.firstName && <p className="mt-1 text-xs text-destructive">{shipForm.formState.errors.firstName.message}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">{t.lastName}</label>
                  <Input {...shipForm.register('lastName')} />
                  {shipForm.formState.errors.lastName && <p className="mt-1 text-xs text-destructive">{shipForm.formState.errors.lastName.message}</p>}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">{t.email}</label>
                <Input type="email" {...shipForm.register('email')} />
                {shipForm.formState.errors.email && <p className="mt-1 text-xs text-destructive">{shipForm.formState.errors.email.message}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">{t.address}</label>
                <Input {...shipForm.register('address')} />
                {shipForm.formState.errors.address && <p className="mt-1 text-xs text-destructive">{shipForm.formState.errors.address.message}</p>}
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div><label className="mb-1 block text-sm font-medium">{t.city}</label><Input {...shipForm.register('city')} /></div>
                <div><label className="mb-1 block text-sm font-medium">{t.state}</label><Input {...shipForm.register('state')} /></div>
                <div><label className="mb-1 block text-sm font-medium">{t.zipCode}</label><Input {...shipForm.register('zip')} /></div>
              </div>
              <div><label className="mb-1 block text-sm font-medium">{t.country}</label><Input {...shipForm.register('country')} /></div>
              <Button type="submit" className="w-full">{t.continueToPayment}</Button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={payForm.handleSubmit(onSubmitPayment)} className={`space-y-4 p-6 ${panel}`}>
              <h2 className="mb-4 text-lg font-bold" style={{ fontFamily: theme.fonts.heading }}>{t.paymentInfo}</h2>
              <p className="mb-4 rounded-md bg-muted p-3 text-sm text-muted-foreground">{t.demoCheckoutNote}</p>
              <div><label className="mb-1 block text-sm font-medium">{t.cardNumber}</label><Input placeholder="4242 4242 4242 4242" {...payForm.register('cardNumber' as const)} /></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="mb-1 block text-sm font-medium">{t.expiry}</label><Input placeholder="MM/YY" {...payForm.register('expiry' as const)} /></div>
                <div><label className="mb-1 block text-sm font-medium">{t.cvc}</label><Input placeholder="123" {...payForm.register('cvc' as const)} /></div>
              </div>
              <div><label className="mb-1 block text-sm font-medium">{t.nameOnCard}</label><Input {...payForm.register('nameOnCard' as const)} /></div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>{t.back}</Button>
                <Button type="submit" className="flex-1">{t.continueToPayment} →</Button>
              </div>
            </form>
          )}

          {step === 3 && shipping && (
            <div className={`space-y-4 p-6 ${panel}`}>
              <h2 className="mb-2 text-lg font-bold" style={{ fontFamily: theme.fonts.heading }}>{t.reviewStep}</h2>
              <div>
                <p className="text-xs uppercase text-muted-foreground">{t.shippingInfo}</p>
                <p className="text-sm">{shipping.firstName} {shipping.lastName} · {shipping.email}</p>
                <p className="text-sm">{shipping.address}, {shipping.city}, {shipping.state} {shipping.zip} · {shipping.country}</p>
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setStep(2)}>{t.back}</Button>
                <Button onClick={onConfirm} className="flex-1">{t.placeOrder}</Button>
              </div>
              <div className="pt-2">
                <WhatsAppOrderButton shipping={shipping} shippingCost={shippingCost} finalTotal={finalTotal} />
              </div>
            </div>
          )}

        </div>

        <div className={`p-6 ${panel}`}>
          <h2 className="mb-4 text-lg font-bold" style={{ fontFamily: theme.fonts.heading }}>{t.orderSummary}</h2>
          <div className="mb-4 space-y-3">
            {items.map(item => (
              <div key={item.product.id} className="flex items-center gap-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded bg-muted">
                  <img src={safeImage(item.product.images[0])} onError={onImgError} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 text-sm">
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-muted-foreground">{t.qty}: {item.quantity}</p>
                </div>
                <span className="text-sm font-medium">{money(item.product.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-1 border-t pt-3 text-sm">
            <div className="flex justify-between"><span>{t.subtotal}</span><span>{money(subtotal)}</span></div>
            <div className="flex justify-between"><span>{t.shipping}</span><span>{shippingCost === 0 ? t.free : money(shippingCost)}</span></div>
            {discount > 0 && <div className="flex justify-between text-primary"><span>{t.discount}</span><span>-{money(discount)}</span></div>}
            <div className="flex justify-between border-t pt-2 text-lg font-bold"><span>{t.total}</span><span>{money(finalTotal)}</span></div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
