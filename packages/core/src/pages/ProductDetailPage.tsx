import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, ArrowLeft, Minus, Plus, Truck, Shield, Bell, BellOff, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useRecentlyViewed } from '@/contexts/RecentlyViewedContext';
import { useAccount } from '@/contexts/AccountContext';
import { getProductById, getReviewsByProduct, getProductsByCategory, getProducts } from '@/data';
import ProductCard from '@/components/product/ProductCard';
import RecentlyViewedRow from '@/components/product/RecentlyViewedRow';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import PageTransition from '@/components/common/PageTransition';
import SEOHead from '@/components/common/SEOHead';
import { Review } from '@/types';
import { safeImage, onImgError } from '@/lib/productImage';
import { localizeCategory } from '@/i18n/dynamic';
import { useMoney } from '@/lib/currency';
import { getStock, isLowStock } from '@/lib/stock';
import { Flame, Share2 } from 'lucide-react';


const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { template, theme } = useTheme();
  const { t, language } = useLanguage();
  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const { add: addRecent } = useRecentlyViewed();
  const { isNotifying, toggleNotify } = useAccount();
  const money = useMoney();

  const product = getProductById(template, id || '');
  const baseReviews = product ? getReviewsByProduct(template, product.id) : [];

  const [selectedImage, setSelectedImage] = useState(0);

  const [imgLoaded, setImgLoaded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [extraReviews, setExtraReviews] = useState<Review[]>([]);
  const [filterStars, setFilterStars] = useState(0);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [newAuthor, setNewAuthor] = useState('');

  useEffect(() => {
    if (product) addRecent(product);
    setSelectedImage(0);
    setImgLoaded(false);
  }, [product?.id]); // eslint-disable-line

  const reviews = product ? [...extraReviews, ...baseReviews] : [];
  const distribution = useMemo(() => {
    const dist = [0, 0, 0, 0, 0];
    reviews.forEach((r) => { const i = Math.min(4, Math.max(0, Math.floor(r.rating) - 1)); dist[i]++; });
    return dist;
  }, [reviews]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="mb-4 text-2xl font-bold">{t.productNotFound}</h1>
        <Link to="/products"><Button variant="outline">{t.backToProducts}</Button></Link>
      </div>
    );
  }

  const filteredReviews = filterStars > 0 ? reviews.filter((r) => Math.floor(r.rating) === filterStars) : reviews;

  const related = getProductsByCategory(template, product.category).filter(p => p.id !== product.id).slice(0, 4);
  const allProducts = getProducts(template);
  const boughtTogether = allProducts.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 2);
  const boughtBundleTotal = product.price + boughtTogether.reduce((s, p) => s + p.price, 0);

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !newAuthor.trim()) return;
    const r: Review = {
      id: 'r-' + Math.random().toString(36).slice(2, 8),
      productId: product.id,
      author: newAuthor.trim().slice(0, 60),
      rating: newRating,
      comment: newComment.trim().slice(0, 800),
      date: new Date().toISOString().slice(0, 10),
    };
    setExtraReviews((p) => [r, ...p]);
    setNewComment(''); setNewAuthor('');
    toast.success(t.reviewSubmitted);
  };

  const handleAdd = () => {
    addItem(product, quantity, selectedVariants);
    toast.success(t.addedToCart, { description: product.name });
  };

  const handleNotify = () => {
    const on = toggleNotify(product.id);
    toast(on ? t.notifyOn : t.notifyOff);
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    sku: product.id,
    offers: {
      '@type': 'Offer', price: product.price.toFixed(2), priceCurrency: 'USD',
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: product.rating, reviewCount: product.reviewCount },
  };

  const stock = getStock(product);
  const low = isLowStock(product);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareToWhatsApp = () => {
    const text = `${product.name} — ${money(product.price)}\n${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };
  const nativeShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: product.name, text: product.description.slice(0, 120), url: shareUrl }); }
      catch {}
    } else {
      try { await navigator.clipboard.writeText(shareUrl); toast.success(t.language === 'pt' ? 'Link copiado' : 'Link copied'); } catch {}
    }
  };

  return (
    <PageTransition>
      <SEOHead
        title={`${product.name} — ${theme.name}`}
        description={product.description.slice(0, 155)}
        image={product.images[0]}
        url={shareUrl}
        jsonLd={jsonLd}
      />
      <div className="container mx-auto px-4 py-8">

        <Link to="/products" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> {t.backToProducts}
        </Link>

        <div className="grid gap-8 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
              {!imgLoaded && <Skeleton className="absolute inset-0 h-full w-full" />}
              <img
                key={selectedImage}
                src={safeImage(product.images[selectedImage])} onError={onImgError}
                alt={product.name}
                onLoad={() => setImgLoaded(true)}
                className={`h-full w-full object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              />
            </div>
            {product.images.length > 1 && (
              <div className="mt-3 flex gap-2">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => { setImgLoaded(false); setSelectedImage(i); }} aria-label={`Image ${i + 1}`} className={`h-20 w-20 overflow-hidden rounded-lg border-2 ${i === selectedImage ? 'border-primary' : 'border-transparent'}`}>
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <p className="mb-1 text-sm font-medium uppercase tracking-wider text-muted-foreground">{localizeCategory(product.category, language)}</p>
            <h1 className="mb-3 text-3xl font-bold" style={{ fontFamily: theme.fonts.heading }}>{product.name}</h1>

            <div className="mb-4 flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-primary text-primary' : 'text-muted'}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{product.rating} ({product.reviewCount} {t.reviews})</span>
            </div>

            <div className="mb-6 flex items-baseline gap-3">
              <span className="text-3xl font-bold">{money(product.price)}</span>
              {product.originalPrice && <span className="text-lg text-muted-foreground line-through">{money(product.originalPrice)}</span>}
            </div>

            {product.inStock && low && (
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-600 dark:text-orange-400">
                <Flame className="h-3.5 w-3.5" /> {language === 'pt' ? `Restam apenas ${stock}` : `Only ${stock} left in stock`}
              </div>
            )}

            <p className="mb-6 text-muted-foreground">{product.description}</p>


            {product.variants?.map(variant => (
              <div key={variant.id} className="mb-4">
                <label className="mb-2 block text-sm font-medium">{variant.name}</label>
                <div className="flex flex-wrap gap-2">
                  {variant.options.map(opt => (
                    <button key={opt} onClick={() => setSelectedVariants(prev => ({ ...prev, [variant.name]: opt }))}
                      className={`rounded-md border px-4 py-2 text-sm transition-colors ${selectedVariants[variant.name] === opt ? 'border-primary bg-primary text-primary-foreground' : 'hover:border-primary'}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium">{t.quantity}</label>
              <div className="inline-flex items-center rounded-md border">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease" className="px-3 py-2 hover:bg-muted"><Minus className="h-4 w-4" /></button>
                <span className="min-w-[3rem] text-center font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} aria-label="Increase" className="px-3 py-2 hover:bg-muted"><Plus className="h-4 w-4" /></button>
              </div>
            </div>

            <div className="mb-6 flex flex-wrap gap-3">
              {product.inStock ? (
                <Button size="lg" className="flex-1 gap-2" onClick={handleAdd}>
                  <ShoppingCart className="h-5 w-5" /> {t.addToCart}
                </Button>
              ) : (
                <Button size="lg" variant="outline" className="flex-1 gap-2" onClick={handleNotify}>
                  {isNotifying(product.id) ? <BellOff className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
                  {isNotifying(product.id) ? t.notifyOff : t.notifyMe}
                </Button>
              )}
              <Button size="lg" variant="outline" onClick={() => toggleItem(product)} aria-label={t.wishlist}>
                <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-primary text-primary' : ''}`} />
              </Button>
              <Button size="lg" variant="outline" onClick={nativeShare} aria-label="Share" title={language === 'pt' ? 'Compartilhar' : 'Share'}>
                <Share2 className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={shareToWhatsApp} aria-label="WhatsApp"
                className="border-[#25D366] text-[#128C7E] hover:bg-[#25D366]/10 dark:text-[#25D366]">
                <MessageCircle className="h-5 w-5" />
              </Button>
            </div>


            <div className="space-y-2 rounded-lg bg-muted/50 p-4">
              <div className="flex items-center gap-2 text-sm"><Truck className="h-4 w-4 text-primary" /> {t.freeShippingOver}</div>
              <div className="flex items-center gap-2 text-sm"><Shield className="h-4 w-4 text-primary" /> {t.returnPolicy}</div>
            </div>
          </motion.div>
        </div>

        {/* Frequently bought together */}
        {boughtTogether.length > 0 && (
          <section className="mt-12 rounded-xl border bg-card p-6">
            <h2 className="mb-4 text-xl font-bold" style={{ fontFamily: theme.fonts.heading }}>{t.boughtTogether}</h2>
            <div className="flex flex-wrap items-center gap-4">
              {[product, ...boughtTogether].map((p, i) => (
                <div key={p.id} className="flex items-center gap-2">
                  <Link to={`/products/${p.id}`} className="block">
                    <img src={safeImage(p.images[0])} onError={onImgError} alt={p.name} className="h-20 w-20 rounded-md object-cover" />
                    <p className="mt-1 max-w-[80px] truncate text-xs">{p.name}</p>
                  </Link>
                  {i < boughtTogether.length && <span className="text-2xl text-muted-foreground">+</span>}
                </div>
              ))}
              <div className="ml-auto text-right">
                <p className="text-xs text-muted-foreground">{t.total}</p>
                <p className="text-xl font-bold">${boughtBundleTotal.toFixed(2)}</p>
                <Button
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    [product, ...boughtTogether].forEach((p) => addItem(p));
                    toast.success(t.addAllToCart);
                  }}
                >
                  {t.addAllToCart}
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Reviews */}
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold" style={{ fontFamily: theme.fonts.heading }}>{t.customerReviews}</h2>

          <div className="mb-6 grid gap-6 rounded-lg border bg-card p-5 md:grid-cols-2">
            <div>
              <p className="mb-3 text-sm font-semibold">{t.ratingDistribution}</p>
              {[5, 4, 3, 2, 1].map((s) => {
                const count = distribution[s - 1];
                const pct = reviews.length ? (count / reviews.length) * 100 : 0;
                return (
                  <button key={s} onClick={() => setFilterStars(filterStars === s ? 0 : s)} className={`mb-1.5 flex w-full items-center gap-2 rounded px-1 py-0.5 text-left text-xs hover:bg-muted ${filterStars === s ? 'bg-muted' : ''}`}>
                    <span className="w-4">{s}</span>
                    <Star className="h-3 w-3 fill-primary text-primary" />
                    <div className="h-2 flex-1 overflow-hidden rounded bg-muted">
                      <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-8 text-right text-muted-foreground">{count}</span>
                  </button>
                );
              })}
              {filterStars > 0 && (
                <button onClick={() => setFilterStars(0)} className="mt-2 text-xs text-primary hover:underline">{t.resetFilters}</button>
              )}
            </div>

            <form onSubmit={submitReview} className="space-y-2">
              <p className="text-sm font-semibold">{t.writeReview}</p>
              <input
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                placeholder={t.yourName}
                maxLength={60}
                className="w-full rounded-md border bg-background px-3 py-1.5 text-sm"
              />
              <div className="flex items-center gap-1">
                <span className="mr-2 text-xs text-muted-foreground">{t.yourRating}:</span>
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} type="button" onClick={() => setNewRating(s)} aria-label={`${s} stars`}>
                    <Star className={`h-5 w-5 ${s <= newRating ? 'fill-primary text-primary' : 'text-muted'}`} />
                  </button>
                ))}
              </div>
              <Textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder={t.yourReview} maxLength={800} rows={3} />
              <Button type="submit" size="sm">{t.submit}</Button>
            </form>
          </div>

          {filteredReviews.length > 0 ? (
            <div className="space-y-4">
              {filteredReviews.map(review => (
                <div key={review.id} className="rounded-lg border bg-card p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{review.author}</span>
                      <div className="flex">{Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-primary text-primary' : 'text-muted'}`} />
                      ))}</div>
                    </div>
                    <span className="text-xs text-muted-foreground">{review.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">{t.noProductsFound}</p>
          )}
        </section>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-2xl font-bold" style={{ fontFamily: theme.fonts.heading }}>{t.youMayAlsoLike}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>

      <RecentlyViewedRow excludeId={product.id} />
    </PageTransition>
  );
};

export default ProductDetailPage;
