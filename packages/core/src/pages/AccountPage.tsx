import { Link, Navigate } from 'react-router-dom';
import { Package, MapPin, User as UserIcon, Heart, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAccount } from '@/contexts/AccountContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import PageTransition from '@/components/common/PageTransition';
import SEOHead from '@/components/common/SEOHead';
import { safeImage, onImgError } from '@/lib/productImage';

const AccountPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { orders, addresses, removeAddress } = useAccount();
  const { items: wishItems } = useWishlist();
  const { theme } = useTheme();
  const { t } = useLanguage();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <PageTransition>
      <SEOHead title={`${t.account} — ${theme.name}`} description="Account dashboard" />
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-2 text-3xl font-bold" style={{ fontFamily: theme.fonts.heading }}>{t.account}</h1>
        <p className="mb-8 text-sm text-muted-foreground">{user?.email}</p>

        <Tabs defaultValue="orders">
          <TabsList className="mb-6">
            <TabsTrigger value="orders" className="gap-2"><Package className="h-4 w-4" />{t.myOrders}</TabsTrigger>
            <TabsTrigger value="addresses" className="gap-2"><MapPin className="h-4 w-4" />{t.savedAddresses}</TabsTrigger>
            <TabsTrigger value="wishlist" className="gap-2"><Heart className="h-4 w-4" />{t.wishlist}</TabsTrigger>
            <TabsTrigger value="info" className="gap-2"><UserIcon className="h-4 w-4" />{t.personalInfo}</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            {orders.length === 0 ? (
              <p className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">{t.noOrders}</p>
            ) : (
              <div className="space-y-3">
                {orders.map((o) => (
                  <div key={o.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card p-4">
                    <div>
                      <p className="font-mono text-sm font-semibold">{o.id}</p>
                      <p className="text-xs text-muted-foreground">{new Date(o.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-1.5">
                      {o.items.slice(0, 4).map((it) => (
                        <img key={it.product.id} src={safeImage(it.product.images[0])} onError={onImgError} alt="" className="h-12 w-12 rounded-md object-cover" />
                      ))}
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{o.status}</span>
                    <p className="font-bold">${o.total.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="addresses">
            {addresses.length === 0 ? (
              <p className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">No saved addresses</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {addresses.map((a, i) => (
                  <div key={i} className="rounded-lg border bg-card p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">{a.firstName} {a.lastName}</p>
                        <p className="text-sm text-muted-foreground">{a.address}</p>
                        <p className="text-sm text-muted-foreground">{a.city}, {a.state} {a.zip}</p>
                        <p className="text-sm text-muted-foreground">{a.country}</p>
                      </div>
                      <button onClick={() => removeAddress(i)} aria-label="Remove" className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="wishlist">
            {wishItems.length === 0 ? (
              <p className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">{t.yourWishlistEmpty}</p>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {wishItems.map((p) => (
                  <Link key={p.id} to={`/products/${p.id}`} className="group block">
                    <div className="aspect-square overflow-hidden rounded-md bg-muted">
                      <img src={safeImage(p.images[0])} onError={onImgError} alt={p.name} className="h-full w-full object-cover transition group-hover:scale-105" />
                    </div>
                    <p className="mt-2 line-clamp-1 text-sm font-medium">{p.name}</p>
                    <p className="text-sm text-muted-foreground">${p.price.toFixed(2)}</p>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="info">
            <div className="max-w-md space-y-2 rounded-lg border bg-card p-6">
              <p><span className="text-sm text-muted-foreground">{t.fullName}:</span> <span className="font-medium">{user?.name}</span></p>
              <p><span className="text-sm text-muted-foreground">{t.email}:</span> <span className="font-medium">{user?.email}</span></p>
              <Button variant="outline" size="sm" className="mt-4">Edit (mock)</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
};

export default AccountPage;
