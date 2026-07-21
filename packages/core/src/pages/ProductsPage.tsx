import { useMemo, useEffect, useCallback, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid, List, SlidersHorizontal, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { getProducts, getCategories, searchProducts } from '@/data';
import ProductCard from '@/components/product/ProductCard';
import ProductCardSkeleton from '@/components/product/ProductCardSkeleton';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import PageTransition from '@/components/common/PageTransition';
import SEOHead from '@/components/common/SEOHead';
import { localizeCategory } from '@/i18n/dynamic';

const PRODUCTS_PER_PAGE = 12;

const ProductsPage = () => {
  const { template, theme } = useTheme();
  const { t, language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  // ---- URL-persisted state ----
  const searchQuery = searchParams.get('search') || '';
  const categorySlug = searchParams.get('category') || '';
  const sortBy = searchParams.get('sort') || 'featured';
  const viewMode = (searchParams.get('view') as 'grid' | 'list') || 'grid';
  const showFilters = searchParams.get('filters') === '1';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const minRating = parseFloat(searchParams.get('rating') || '0') || 0;
  const selectedTags = (searchParams.get('tags') || '').split(',').filter(Boolean);
  const minPriceParam = searchParams.get('minPrice');
  const maxPriceParam = searchParams.get('maxPrice');

  const updateParams = useCallback(
    (patch: Record<string, string | number | null | undefined>, opts?: { resetPage?: boolean }) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(patch).forEach(([k, v]) => {
            if (v === null || v === undefined || v === '' || v === '0') next.delete(k);
            else next.set(k, String(v));
          });
          if (opts?.resetPage) next.delete('page');
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const categories = getCategories(template);
  const allProducts = useMemo(
    () => (searchQuery ? searchProducts(template, searchQuery) : getProducts(template)),
    [template, searchQuery]
  );

  const maxPrice = useMemo(
    () => Math.max(100, ...allProducts.map((p) => p.price)),
    [allProducts]
  );
  const priceRange: [number, number] = [
    minPriceParam ? Math.max(0, parseInt(minPriceParam, 10)) : 0,
    maxPriceParam ? Math.min(maxPrice, parseInt(maxPriceParam, 10)) : maxPrice,
  ];

  // Counts per category (after search filter, before category filter)
  const categoryCounts = useMemo(() => {
    const m = new Map<string, number>();
    allProducts.forEach((p) => m.set(p.category, (m.get(p.category) || 0) + 1));
    return m;
  }, [allProducts]);

  const baseFiltered = useMemo(() => {
    let result = allProducts;
    if (categorySlug) {
      const cat = categories.find((c) => c.slug === categorySlug);
      if (cat) result = result.filter((p) => p.category === cat.name);
    }
    return result;
  }, [allProducts, categorySlug, categories]);

  const tagCounts = useMemo(() => {
    const m = new Map<string, number>();
    baseFiltered.forEach((p) => p.tags.forEach((tag) => m.set(tag, (m.get(tag) || 0) + 1)));
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 16);
  }, [baseFiltered]);

  const filtered = useMemo(() => {
    let result = baseFiltered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (minRating > 0) result = result.filter((p) => p.rating >= minRating);
    if (selectedTags.length > 0) {
      result = result.filter((p) => selectedTags.every((tag) => p.tags.includes(tag)));
    }
    switch (sortBy) {
      case 'price-asc': return [...result].sort((a, b) => a.price - b.price);
      case 'price-desc': return [...result].sort((a, b) => b.price - a.price);
      case 'rating': return [...result].sort((a, b) => b.rating - a.rating);
      case 'name': return [...result].sort((a, b) => a.name.localeCompare(b.name));
      default: return result;
    }
  }, [baseFiltered, priceRange, minRating, selectedTags, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PRODUCTS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PRODUCTS_PER_PAGE, safePage * PRODUCTS_PER_PAGE);

  // If filters reduce results below current page, snap back
  useEffect(() => {
    if (page > totalPages) updateParams({ page: null });
  }, [page, totalPages, updateParams]);

  // Transient skeleton state on filter/sort/page/category/search change
  const [isPending, setIsPending] = useState(false);
  const filterKey = `${categorySlug}|${sortBy}|${safePage}|${minRating}|${selectedTags.join(',')}|${priceRange[0]}-${priceRange[1]}|${searchQuery}|${viewMode}`;
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    setIsPending(true);
    const id = window.setTimeout(() => setIsPending(false), 350);
    return () => window.clearTimeout(id);
  }, [filterKey]);


  const pageTitle = searchQuery
    ? `${t.resultsFor} "${searchQuery}"`
    : categorySlug
      ? categories.find((c) => c.slug === categorySlug)?.name || t.allProducts
      : t.allProducts;

  const toggleTag = (tag: string) => {
    const next = selectedTags.includes(tag)
      ? selectedTags.filter((x) => x !== tag)
      : [...selectedTags, tag];
    updateParams({ tags: next.join(',') || null }, { resetPage: true });
  };

  const setCategory = (slug: string | null) => {
    updateParams({ category: slug, tags: null }, { resetPage: true });
  };

  const setPriceRange = (v: [number, number]) => {
    updateParams(
      {
        minPrice: v[0] > 0 ? v[0] : null,
        maxPrice: v[1] < maxPrice ? v[1] : null,
      },
      { resetPage: true }
    );
  };

  const setMinRating = (v: number) => updateParams({ rating: v > 0 ? v : null }, { resetPage: true });
  const setSortBy = (v: string) => updateParams({ sort: v === 'featured' ? null : v }, { resetPage: true });
  const setViewMode = (v: 'grid' | 'list') => updateParams({ view: v === 'grid' ? null : v });
  const setShowFilters = (v: boolean) => updateParams({ filters: v ? 1 : null });
  const setPage = (p: number) => updateParams({ page: p > 1 ? p : null });

  const resetAll = () => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams();
        const keep = ['search', 'category'];
        keep.forEach((k) => {
          const v = prev.get(k);
          if (v) next.set(k, v);
        });
        return next;
      },
      { replace: true }
    );
  };

  const hasActiveFilters =
    priceRange[0] > 0 ||
    priceRange[1] < maxPrice ||
    minRating > 0 ||
    selectedTags.length > 0;

  const totalAcrossCategories = allProducts.length;

  return (
    <PageTransition>
      <SEOHead
        title={`${pageTitle} — ${theme.name}`}
        description={`Browse ${filtered.length} ${template} products.`}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold" style={{ fontFamily: theme.fonts.heading }}>{pageTitle}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {filtered.length} {t.products}
            {filtered.length !== baseFiltered.length && (
              <span className="opacity-70"> / {baseFiltered.length}</span>
            )}
          </p>
        </div>

        {/* Category chips with counts */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setCategory(null)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              !categorySlug ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {t.all ?? 'All'} <span className="opacity-70">({totalAcrossCategories})</span>
          </button>
          {categories.map((cat) => {
            const count = categoryCounts.get(cat.name) || 0;
            const active = categorySlug === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.slug)}
                disabled={count === 0}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors disabled:opacity-40 ${
                  active ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {localizeCategory(cat.name, language)} <span className="opacity-70">({count})</span>
              </button>
            );
          })}
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-4 rounded-lg border bg-card p-3">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={showFilters ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-1"
            >
              <SlidersHorizontal className="h-4 w-4" /> {t.filters}
              {hasActiveFilters && (
                <span className="ml-1 rounded-full bg-primary-foreground/20 px-1.5 text-[10px]">
                  {(priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0) +
                    (minRating > 0 ? 1 : 0) +
                    selectedTags.length}
                </span>
              )}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">{t.featured}</SelectItem>
                <SelectItem value="price-asc">{t.priceLowHigh}</SelectItem>
                <SelectItem value="price-desc">{t.priceHighLow}</SelectItem>
                <SelectItem value="rating">{t.topRated}</SelectItem>
                <SelectItem value="name">{t.nameAZ}</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex rounded-md border">
              <button aria-label="Grid" onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-muted' : ''}`}><Grid className="h-4 w-4" /></button>
              <button aria-label="List" onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-muted' : ''}`}><List className="h-4 w-4" /></button>
            </div>
          </div>
        </div>

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase text-muted-foreground">{t.activeFilters}:</span>
            {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
              <button onClick={() => setPriceRange([0, maxPrice])} className="inline-flex items-center gap-1 rounded-full border bg-card px-2.5 py-1 text-xs hover:bg-muted">
                ${priceRange[0]}–${priceRange[1]} <X className="h-3 w-3" />
              </button>
            )}
            {minRating > 0 && (
              <button onClick={() => setMinRating(0)} className="inline-flex items-center gap-1 rounded-full border bg-card px-2.5 py-1 text-xs hover:bg-muted">
                {minRating}+ ★ <X className="h-3 w-3" />
              </button>
            )}
            {selectedTags.map((tag) => (
              <button key={tag} onClick={() => toggleTag(tag)} className="inline-flex items-center gap-1 rounded-full border bg-card px-2.5 py-1 text-xs hover:bg-muted">
                {tag} <X className="h-3 w-3" />
              </button>
            ))}
            <button onClick={resetAll} className="text-xs text-primary hover:underline">{t.resetFilters}</button>
          </div>
        )}

        {showFilters && (
          <div className="mb-6 grid gap-6 rounded-lg border bg-card p-4 sm:grid-cols-3">
            <div>
              <label className="mb-3 block text-sm font-medium">
                {t.priceRange}: <span className="text-muted-foreground">${priceRange[0]} – ${priceRange[1]}</span>
              </label>
              <Slider
                min={0}
                max={maxPrice}
                step={Math.max(1, Math.round(maxPrice / 100))}
                value={priceRange}
                onValueChange={(v) => setPriceRange([v[0], v[1]] as [number, number])}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">{t.minRating}</label>
              <Select value={String(minRating)} onValueChange={(v) => setMinRating(+v)}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">{t.all}</SelectItem>
                  <SelectItem value="3">3+ {t.stars}</SelectItem>
                  <SelectItem value="4">4+ {t.stars}</SelectItem>
                  <SelectItem value="4.5">4.5+ {t.stars}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Tags</label>
              <div className="flex max-h-40 flex-wrap gap-1.5 overflow-y-auto">
                {tagCounts.map(([tag, count]) => {
                  const active = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`rounded-full border px-2.5 py-1 text-xs transition ${active ? 'border-primary bg-primary text-primary-foreground' : 'hover:border-primary'}`}
                    >
                      {tag} <span className="opacity-70">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait" initial={false}>
          {isPending && filtered.length > 0 ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className={viewMode === 'grid' ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'space-y-4'}
              aria-busy="true"
              aria-live="polite"
            >
              {(() => {
                // Match skeleton count to what is about to render on this page,
                // capped by the per-page size and the current category total.
                const expectedOnPage = Math.min(
                  PRODUCTS_PER_PAGE,
                  Math.max(0, filtered.length - (safePage - 1) * PRODUCTS_PER_PAGE)
                );
                // Fallback minimum: avoid empty look while still recalculating.
                // List mode reads better with fewer rows; grid fills naturally.
                const minCount = viewMode === 'list' ? 3 : 4;
                const fallback = Math.min(
                  PRODUCTS_PER_PAGE,
                  Math.max(minCount, baseFiltered.length || allProducts.length || minCount)
                );
                const count = Math.max(
                  1,
                  Math.min(PRODUCTS_PER_PAGE, expectedOnPage > 0 ? expectedOnPage : fallback)
                );
                return Array.from({ length: count }).map((_, i) => (
                  <ProductCardSkeleton key={i} viewMode={viewMode} />
                ));
              })()}
            </motion.div>
          ) : paginated.length > 0 ? (
            <motion.div
              key={`results-${filterKey}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className={viewMode === 'grid' ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'space-y-4'}>
                {paginated.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <Button variant="outline" size="sm" disabled={safePage === 1} onClick={() => setPage(safePage - 1)} aria-label="Previous"><ChevronLeft className="h-4 w-4" /></Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Button key={p} variant={p === safePage ? 'default' : 'outline'} size="sm" onClick={() => setPage(p)} className="h-9 w-9">{p}</Button>
                  ))}
                  <Button variant="outline" size="sm" disabled={safePage === totalPages} onClick={() => setPage(safePage + 1)} aria-label="Next"><ChevronRight className="h-4 w-4" /></Button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={viewMode === 'grid' ? 'grid grid-cols-1' : 'space-y-4'}
            >
              <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed bg-card/50 px-6 py-20 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                  <SlidersHorizontal className="h-6 w-6 text-muted-foreground" aria-hidden />
                </div>
                <p className="text-lg font-medium">{t.noProductsFound}</p>
                <p className="max-w-md text-sm text-muted-foreground">{t.noProductsFoundDesc}</p>
                {(hasActiveFilters || categorySlug || searchQuery) && (
                  <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                    {hasActiveFilters && (
                      <Button size="sm" variant="outline" onClick={resetAll}>
                        {t.resetFilters}
                      </Button>
                    )}
                    {categorySlug && (
                      <Button size="sm" variant="ghost" onClick={() => setCategory(null)}>
                        {t.all ?? 'All'}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </PageTransition>
  );
};

export default ProductsPage;
