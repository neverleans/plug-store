import { Link } from 'react-router-dom';
import { CheckCircle, Package } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const OrderConfirmationPage = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;

  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
      <CheckCircle className="mb-6 h-20 w-20 text-primary" />
      <h1 className="mb-2 text-3xl font-bold" style={{ fontFamily: theme.fonts.heading }}>{t.orderConfirmed}</h1>
      <p className="mb-1 text-muted-foreground">{t.thankYouPurchase}</p>
      <p className="mb-8 text-sm text-muted-foreground">{t.orderId}: <span className="font-mono font-medium text-foreground">{orderId}</span></p>

      <div className="mb-8 max-w-sm rounded-lg border bg-card p-6 text-left">
        <div className="flex items-center gap-3">
          <Package className="h-8 w-8 text-primary" />
          <div>
            <p className="font-medium">{t.estimatedDelivery}</p>
            <p className="text-sm text-muted-foreground">{t.businessDays}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Link to="/products"><Button>{t.continueShopping}</Button></Link>
        <Link to="/"><Button variant="outline">{t.goHome}</Button></Link>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
