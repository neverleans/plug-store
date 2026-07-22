import { useMemo, useRef, useState } from 'react';
import {
  TrendingUp, Package, DollarSign, Users, Save, RotateCcw, Check, Copy, ExternalLink, QrCode,
  Upload, FileDown, FileText, Trash2, Plus, Eye, EyeOff,
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteConfig, Coupon, CurrencyCode, DEFAULT_COUPONS } from '@/contexts/SiteConfigContext';
import { themeConfigs } from '@/themes/configs';
import { getProducts, setImportedProducts, getImportedProducts, clearImportedProducts } from '@/data';
import { IndustryTemplate } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import PageTransition from '@/components/common/PageTransition';
import SEOHead from '@/components/common/SEOHead';
import { localizeTemplate } from '@/i18n/dynamic';
import { toast } from 'sonner';
import { downloadProductsCsv, openCatalogPrintable, parseProductsCsv } from '@/lib/exportCatalog';
import { CURRENCIES } from '@/lib/currency';

const TEMPLATES: IndustryTemplate[] = [
  'fashion', 'electronics', 'food', 'furniture', 'beauty',
  'sports', 'books', 'pets', 'automotive', 'art',
  'jewelry', 'homeware', 'market', 'wellness', 'stationery',
];

const seed = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result));
    r.onerror = rej;
    r.readAsDataURL(file);
  });

const AdminPage = () => {
  const { theme, template, setTemplate } = useTheme();
  const { t, language } = useLanguage();
  const { config, updateConfig, resetConfig, setPreviewAsCustomer } = useSiteConfig();
  const [draft, setDraft] = useState(config);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const favInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  const salesData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const base = seed(template);
    return months.map((m, i) => ({ month: m, sales: 8000 + ((base * (i + 1)) % 12000), orders: 80 + ((base * (i + 3)) % 220) }));
  }, [template]);

  const topProducts = useMemo(() => {
    const products = getProducts(template);
    return [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 6)
      .map((p) => ({ name: p.name.slice(0, 18), revenue: Math.round(p.price * (p.reviewCount + 50)) }));
  }, [template]);

  const conversionByTheme = useMemo(
    () => TEMPLATES.slice(0, 10).map((tpl) => ({ theme: tpl.slice(0, 6), rate: +(((seed(tpl) % 600) / 100) + 1.2).toFixed(2) })),
    []
  );

  const totalSales = salesData.reduce((s, d) => s + d.sales, 0);
  const totalOrders = salesData.reduce((s, d) => s + d.orders, 0);
  const aov = totalOrders ? Math.round(totalSales / totalOrders) : 0;
  const visitors = totalOrders * 14;

  const chartConfig = {
    sales: { label: t.salesOverview, color: 'hsl(var(--primary))' },
    orders: { label: t.myOrders, color: 'hsl(var(--accent))' },
    revenue: { label: 'Revenue', color: 'hsl(var(--primary))' },
    rate: { label: 'Conversion', color: 'hsl(var(--primary))' },
  };

  const isPt = language === 'pt';

  const handleSave = () => {
    updateConfig(draft);
    toast.success(isPt ? 'Configurações salvas' : 'Settings saved');
  };
  const handleReset = () => {
    resetConfig();
    setDraft({
      companyName: '', tagline: '', contactEmail: '', contactPhone: '', address: '',
      footerText: '', shippingBanner: '', publicSlug: 'catalog',
      currency: 'USD', logoDataUrl: '', faviconDataUrl: '', whatsappPhone: '',
      pixKey: '', pixMerchantCity: '',
      instagramUrl: '', tiktokUrl: '', facebookUrl: '', gaId: '', metaPixelId: '',
      coupons: DEFAULT_COUPONS, previewAsCustomer: false,
    });
    toast.success(isPt ? 'Configurações restauradas' : 'Settings reset');
  };

  const slugify = (s: string) =>
    s.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'catalog';

  const currentSlug = (draft.publicSlug || 'catalog').toLowerCase();
  const publicUrl = `${window.location.origin}/c/${currentSlug}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(publicUrl)}`;
  const copyUrl = async () => {
    try { await navigator.clipboard.writeText(publicUrl); toast.success(isPt ? 'Link copiado' : 'Link copied'); }
    catch { toast.error(isPt ? 'Falha ao copiar' : 'Copy failed'); }
  };

  // ── logo/favicon upload ────────────────
  const onLogoFile = async (f: File | undefined) => {
    if (!f) return;
    if (f.size > 1_500_000) return toast.error(isPt ? 'Arquivo grande demais (max 1.5MB)' : 'File too large (1.5MB max)');
    const url = await readFileAsDataUrl(f);
    setDraft({ ...draft, logoDataUrl: url });
  };
  const onFaviconFile = async (f: File | undefined) => {
    if (!f) return;
    if (f.size > 500_000) return toast.error(isPt ? 'Favicon deve ter até 500KB' : 'Favicon must be under 500KB');
    const url = await readFileAsDataUrl(f);
    setDraft({ ...draft, faviconDataUrl: url });
  };

  // ── coupons editor ─────────────────────
  const updateCoupon = (i: number, patch: Partial<Coupon>) => {
    const list = [...draft.coupons];
    list[i] = { ...list[i], ...patch };
    setDraft({ ...draft, coupons: list });
  };
  const removeCoupon = (i: number) =>
    setDraft({ ...draft, coupons: draft.coupons.filter((_, idx) => idx !== i) });
  const addCoupon = () =>
    setDraft({ ...draft, coupons: [...draft.coupons, { code: 'NEW10', type: 'percent', value: 10, label: '10% off' }] });

  // ── catalog export/import ──────────────
  const products = getProducts(template);
  const brand = config.companyName || theme.name;
  const importedCount = getImportedProducts(template).length;

  const onCsvFile = async (f: File | undefined) => {
    if (!f) return;
    const text = await f.text();
    const parsed = parseProductsCsv(text, template);
    if (!parsed.length) return toast.error(isPt ? 'CSV vazio ou inválido' : 'Empty or invalid CSV');
    const existing = getImportedProducts(template);
    setImportedProducts(template, [...existing, ...parsed]);
    toast.success(isPt ? `${parsed.length} produtos importados` : `${parsed.length} products imported`);
  };
  const doClearImports = () => {
    clearImportedProducts(template);
    toast.success(isPt ? 'Produtos importados removidos' : 'Imported products cleared');
  };

  return (
    <PageTransition>
      <SEOHead title={`${t.admin} — ${theme.name}`} description="Admin panel" />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="mb-1 text-3xl font-bold" style={{ fontFamily: theme.fonts.heading }}>{t.dashboard}</h1>
            <p className="text-sm text-muted-foreground">{isPt ? 'Painel administrativo' : 'Admin panel'} — {theme.name}</p>
          </div>
          <Button
            variant={config.previewAsCustomer ? 'default' : 'outline'}
            size="sm"
            onClick={() => { setPreviewAsCustomer(!config.previewAsCustomer); toast.success(config.previewAsCustomer ? (isPt?'Modo admin':'Admin mode') : (isPt?'Modo cliente':'Customer mode')); }}
            className="gap-2"
          >
            {config.previewAsCustomer ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {config.previewAsCustomer ? (isPt?'Sair da visão do cliente':'Exit customer view') : (isPt?'Visualizar como cliente':'Preview as customer')}
          </Button>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="mb-6 flex-wrap">
            <TabsTrigger value="dashboard">{t.dashboard}</TabsTrigger>
            <TabsTrigger value="settings">{isPt ? 'Configurações' : 'Settings'}</TabsTrigger>
            <TabsTrigger value="catalog">{isPt ? 'Catálogo' : 'Catalog'}</TabsTrigger>
            <TabsTrigger value="marketing">{isPt ? 'Marketing' : 'Marketing'}</TabsTrigger>
          </TabsList>

          {/* ============ DASHBOARD ============ */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: DollarSign, label: 'Revenue', value: `$${(totalSales / 1000).toFixed(1)}k` },
                { icon: Package, label: 'Orders', value: totalOrders.toLocaleString() },
                { icon: TrendingUp, label: 'AOV', value: `$${aov}` },
                { icon: Users, label: 'Visitors', value: visitors.toLocaleString() },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-lg border bg-card p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs uppercase text-muted-foreground"><Icon className="h-4 w-4" /> {label}</div>
                  <p className="text-2xl font-bold">{value}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-lg border bg-card p-4">
                <h2 className="mb-4 font-semibold">{t.salesOverview}</h2>
                <ChartContainer config={chartConfig} className="h-72 w-full">
                  <ResponsiveContainer>
                    <LineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="orders" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <h2 className="mb-4 font-semibold">{t.topProducts}</h2>
                <ChartContainer config={chartConfig} className="h-72 w-full">
                  <ResponsiveContainer>
                    <BarChart data={topProducts} layout="vertical" margin={{ left: 24 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                      <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} width={120} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              <div className="rounded-lg border bg-card p-4 lg:col-span-2">
                <h2 className="mb-4 font-semibold">{t.conversionByTheme}</h2>
                <ChartContainer config={chartConfig} className="h-64 w-full">
                  <ResponsiveContainer>
                    <BarChart data={conversionByTheme}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="theme" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} unit="%" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="rate" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>
          </TabsContent>

          {/* ============ SETTINGS ============ */}
          <TabsContent value="settings" className="space-y-8">
            {/* Template picker */}
            <section className="rounded-lg border bg-card p-6">
              <h2 className="mb-1 text-lg font-semibold" style={{ fontFamily: theme.fonts.heading }}>{isPt ? 'Modelo da loja' : 'Store template'}</h2>
              <p className="mb-5 text-sm text-muted-foreground">
                {isPt ? 'Escolha o tema/indústria da loja.' : 'Choose the store industry theme.'}
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                {TEMPLATES.map((tpl) => {
                  const cfg = themeConfigs[tpl];
                  const active = tpl === template;
                  return (
                    <button key={tpl} onClick={() => { setTemplate(tpl); toast.success(isPt ? `Modelo: ${cfg.name}` : `Template: ${cfg.name}`); }}
                      className={`group relative flex flex-col items-start gap-2 rounded-lg border p-3 text-left transition-all hover:shadow-md ${active ? 'border-primary ring-2 ring-primary/40' : 'border-border'}`}>
                      <div className="flex gap-1">
                        <span className="h-6 w-6 rounded-full border" style={{ background: `hsl(${cfg.colors.primary})` }} />
                        <span className="h-6 w-6 rounded-full border" style={{ background: `hsl(${cfg.colors.accent})` }} />
                        <span className="h-6 w-6 rounded-full border" style={{ background: `hsl(${cfg.colors.secondary})` }} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold" style={{ fontFamily: cfg.fonts.heading }}>{cfg.name}</p>
                        <p className="truncate text-xs text-muted-foreground capitalize">{localizeTemplate(tpl, language)}</p>
                      </div>
                      {active && <Check className="absolute right-2 top-2 h-4 w-4 text-primary" />}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Company */}
            <section className="rounded-lg border bg-card p-6">
              <h2 className="mb-1 text-lg font-semibold" style={{ fontFamily: theme.fonts.heading }}>{isPt ? 'Empresa e site' : 'Company & site'}</h2>
              <p className="mb-5 text-sm text-muted-foreground">{isPt ? 'Deixe em branco para usar padrões do tema.' : 'Leave blank to use theme defaults.'}</p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>{isPt ? 'Nome da empresa' : 'Company name'}</Label>
                  <Input value={draft.companyName} onChange={(e) => setDraft({ ...draft, companyName: e.target.value })} placeholder={theme.name} maxLength={60} />
                </div>
                <div className="space-y-1.5">
                  <Label>{isPt ? 'Slogan' : 'Tagline'}</Label>
                  <Input value={draft.tagline} onChange={(e) => setDraft({ ...draft, tagline: e.target.value })} placeholder={theme.tagline} maxLength={120} />
                </div>
                <div className="space-y-1.5">
                  <Label>{isPt ? 'Email' : 'Email'}</Label>
                  <Input type="email" value={draft.contactEmail} onChange={(e) => setDraft({ ...draft, contactEmail: e.target.value })} placeholder="hello@example.com" maxLength={120} />
                </div>
                <div className="space-y-1.5">
                  <Label>{isPt ? 'Telefone' : 'Phone'}</Label>
                  <Input value={draft.contactPhone} onChange={(e) => setDraft({ ...draft, contactPhone: e.target.value })} placeholder="+55 11 90000-0000" maxLength={40} />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label>{isPt ? 'Endereço' : 'Address'}</Label>
                  <Input value={draft.address} onChange={(e) => setDraft({ ...draft, address: e.target.value })} maxLength={160} />
                </div>
                <div className="space-y-1.5">
                  <Label>{isPt ? 'Moeda' : 'Currency'}</Label>
                  <select value={draft.currency} onChange={(e) => setDraft({ ...draft, currency: e.target.value as CurrencyCode })}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                    {(Object.keys(CURRENCIES) as CurrencyCode[]).map((c) => (
                      <option key={c} value={c}>{CURRENCIES[c].symbol} {c}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>{isPt ? 'WhatsApp (com DDI)' : 'WhatsApp (with country code)'}</Label>
                  <Input value={draft.whatsappPhone} onChange={(e) => setDraft({ ...draft, whatsappPhone: e.target.value })} placeholder="5511999998888" maxLength={20} />
                </div>
                <div className="space-y-1.5">
                  <Label>{isPt ? 'Chave Pix' : 'Pix key'}</Label>
                  <Input value={draft.pixKey} onChange={(e) => setDraft({ ...draft, pixKey: e.target.value })} placeholder={isPt ? 'CPF, e-mail, telefone ou chave aleatória' : 'CPF, e-mail, phone or random key'} maxLength={77} />
                </div>
                <div className="space-y-1.5">
                  <Label>{isPt ? 'Cidade do recebedor (Pix)' : 'Merchant city (Pix)'}</Label>
                  <Input value={draft.pixMerchantCity} onChange={(e) => setDraft({ ...draft, pixMerchantCity: e.target.value })} placeholder="Sao Paulo" maxLength={15} />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label>{isPt ? 'Faixa promocional' : 'Top promo banner'}</Label>
                  <Input value={draft.shippingBanner} onChange={(e) => setDraft({ ...draft, shippingBanner: e.target.value })} placeholder={t.freeShippingBanner} maxLength={160} />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label>{isPt ? 'Rodapé' : 'Footer text'}</Label>
                  <Textarea value={draft.footerText} onChange={(e) => setDraft({ ...draft, footerText: e.target.value })} placeholder={`© 2026 ${theme.name}. ${t.allRightsReserved}`} rows={2} maxLength={240} />
                </div>
              </div>

              {/* Logo & favicon */}
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-dashed p-4">
                  <Label className="mb-2 block">{isPt ? 'Logo' : 'Logo'}</Label>
                  <div className="flex items-center gap-3">
                    {draft.logoDataUrl ? (
                      <img src={draft.logoDataUrl} alt="Logo" className="h-14 w-14 rounded-md border bg-background object-contain" />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-md border bg-muted text-xs text-muted-foreground">—</div>
                    )}
                    <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => onLogoFile(e.target.files?.[0])} />
                    <Button variant="outline" size="sm" onClick={() => logoInputRef.current?.click()} className="gap-1.5"><Upload className="h-3.5 w-3.5" /> {isPt ? 'Enviar' : 'Upload'}</Button>
                    {draft.logoDataUrl && <Button variant="ghost" size="sm" onClick={() => setDraft({ ...draft, logoDataUrl: '' })}>{isPt ? 'Remover' : 'Remove'}</Button>}
                  </div>
                </div>
                <div className="rounded-lg border border-dashed p-4">
                  <Label className="mb-2 block">{isPt ? 'Favicon' : 'Favicon'}</Label>
                  <div className="flex items-center gap-3">
                    {draft.faviconDataUrl ? (
                      <img src={draft.faviconDataUrl} alt="Favicon" className="h-10 w-10 rounded border bg-background object-contain" />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded border bg-muted text-xs text-muted-foreground">—</div>
                    )}
                    <input ref={favInputRef} type="file" accept="image/png,image/x-icon,image/svg+xml" className="hidden" onChange={(e) => onFaviconFile(e.target.files?.[0])} />
                    <Button variant="outline" size="sm" onClick={() => favInputRef.current?.click()} className="gap-1.5"><Upload className="h-3.5 w-3.5" /> {isPt ? 'Enviar' : 'Upload'}</Button>
                    {draft.faviconDataUrl && <Button variant="ghost" size="sm" onClick={() => setDraft({ ...draft, faviconDataUrl: '' })}>{isPt ? 'Remover' : 'Remove'}</Button>}
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="space-y-1.5">
                  <Label>Instagram</Label>
                  <Input value={draft.instagramUrl} onChange={(e) => setDraft({ ...draft, instagramUrl: e.target.value })} placeholder="https://instagram.com/..." />
                </div>
                <div className="space-y-1.5">
                  <Label>TikTok</Label>
                  <Input value={draft.tiktokUrl} onChange={(e) => setDraft({ ...draft, tiktokUrl: e.target.value })} placeholder="https://tiktok.com/@..." />
                </div>
                <div className="space-y-1.5">
                  <Label>Facebook</Label>
                  <Input value={draft.facebookUrl} onChange={(e) => setDraft({ ...draft, facebookUrl: e.target.value })} placeholder="https://facebook.com/..." />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button onClick={handleSave} className="gap-2"><Save className="h-4 w-4" /> {isPt ? 'Salvar' : 'Save'}</Button>
                <Button variant="outline" onClick={handleReset} className="gap-2"><RotateCcw className="h-4 w-4" /> {isPt ? 'Restaurar' : 'Reset'}</Button>
              </div>
            </section>

            {/* Public catalog URL */}
            <section className="rounded-lg border bg-card p-6">
              <h2 className="mb-1 text-lg font-semibold" style={{ fontFamily: theme.fonts.heading }}>{isPt ? 'Catálogo público' : 'Public catalog'}</h2>
              <p className="mb-5 text-sm text-muted-foreground">
                {isPt ? 'Link limpo para clientes. Ótimo para QR code em loja física.' : 'Clean link for customers. Great for in-store QR codes.'}
              </p>
              <div className="grid gap-6 md:grid-cols-[1fr_auto]">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>{isPt ? 'Slug do catálogo' : 'Catalog slug'}</Label>
                    <div className="flex items-center gap-2">
                      <span className="whitespace-nowrap rounded-md border bg-muted px-3 py-2 text-xs text-muted-foreground">{window.location.origin}/c/</span>
                      <Input value={draft.publicSlug} onChange={(e) => setDraft({ ...draft, publicSlug: e.target.value })}
                        onBlur={(e) => setDraft({ ...draft, publicSlug: slugify(e.target.value) })} placeholder="catalog" maxLength={40} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>{isPt ? 'Link público' : 'Public link'}</Label>
                    <div className="flex flex-wrap items-center gap-2">
                      <code className="flex-1 min-w-0 truncate rounded-md border bg-muted px-3 py-2 text-xs">{publicUrl}</code>
                      <Button variant="outline" size="sm" onClick={copyUrl} className="gap-1.5"><Copy className="h-3.5 w-3.5" /> {isPt ? 'Copiar' : 'Copy'}</Button>
                      <a href={publicUrl} target="_blank" rel="noreferrer"><Button variant="outline" size="sm" className="gap-1.5"><ExternalLink className="h-3.5 w-3.5" /> {isPt ? 'Abrir' : 'Open'}</Button></a>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2 rounded-lg border bg-background p-4">
                  <img src={qrUrl} alt="QR code" className="h-40 w-40 rounded" loading="lazy" />
                  <a href={qrUrl} download="catalog-qr.png" className="flex items-center gap-1.5 text-xs text-primary hover:underline">
                    <QrCode className="h-3.5 w-3.5" /> {isPt ? 'Baixar QR' : 'Download QR'}
                  </a>
                </div>
              </div>
            </section>
          </TabsContent>

          {/* ============ CATALOG ============ */}
          <TabsContent value="catalog" className="space-y-6">
            <section className="rounded-lg border bg-card p-6">
              <h2 className="mb-1 text-lg font-semibold" style={{ fontFamily: theme.fonts.heading }}>{isPt ? 'Exportar catálogo' : 'Export catalog'}</h2>
              <p className="mb-5 text-sm text-muted-foreground">
                {isPt ? `${products.length} produtos no tema atual.` : `${products.length} products in current theme.`}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" onClick={() => downloadProductsCsv(products, `${brand}-catalog.csv`)} className="gap-2">
                  <FileDown className="h-4 w-4" /> {isPt ? 'Exportar CSV' : 'Export CSV'}
                </Button>
                <Button variant="outline" onClick={() => openCatalogPrintable(products, `${brand} — Catalog`)} className="gap-2">
                  <FileText className="h-4 w-4" /> {isPt ? 'PDF / Imprimir' : 'PDF / Print'}
                </Button>
              </div>
            </section>

            <section className="rounded-lg border bg-card p-6">
              <h2 className="mb-1 text-lg font-semibold" style={{ fontFamily: theme.fonts.heading }}>{isPt ? 'Importar CSV' : 'Import CSV'}</h2>
              <p className="mb-4 text-sm text-muted-foreground">
                {isPt ? 'Cabeçalhos: id,name,category,price,description,tags (separados por |),inStock' : 'Headers: id,name,category,price,description,tags (pipe-separated),inStock'}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <input ref={csvInputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => { onCsvFile(e.target.files?.[0]); if (csvInputRef.current) csvInputRef.current.value = ''; }} />
                <Button onClick={() => csvInputRef.current?.click()} className="gap-2"><Upload className="h-4 w-4" /> {isPt ? 'Enviar CSV' : 'Upload CSV'}</Button>
                {importedCount > 0 && (
                  <>
                    <span className="text-sm text-muted-foreground">{isPt ? `${importedCount} importados` : `${importedCount} imported`}</span>
                    <Button variant="ghost" size="sm" onClick={doClearImports} className="gap-1.5 text-destructive"><Trash2 className="h-3.5 w-3.5" /> {isPt ? 'Limpar' : 'Clear'}</Button>
                  </>
                )}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {isPt ? 'Produtos importados aparecem no topo do catálogo do tema atual.' : 'Imported products appear at the top of the current theme catalog.'}
              </p>
            </section>
          </TabsContent>

          {/* ============ MARKETING ============ */}
          <TabsContent value="marketing" className="space-y-6">
            <section className="rounded-lg border bg-card p-6">
              <h2 className="mb-1 text-lg font-semibold" style={{ fontFamily: theme.fonts.heading }}>{isPt ? 'Cupons de desconto' : 'Discount coupons'}</h2>
              <p className="mb-5 text-sm text-muted-foreground">
                {isPt ? 'Códigos aplicados no carrinho. Percentual ou valor fixo.' : 'Codes applied at checkout. Percent or flat.'}
              </p>
              <div className="space-y-3">
                {draft.coupons.map((c, i) => (
                  <div key={i} className="grid gap-2 rounded-md border bg-background p-3 sm:grid-cols-[1fr_130px_100px_1fr_auto]">
                    <Input value={c.code} onChange={(e) => updateCoupon(i, { code: e.target.value.toUpperCase().slice(0, 24) })} placeholder="CODE" />
                    <select value={c.type} onChange={(e) => updateCoupon(i, { type: e.target.value as Coupon['type'] })} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
                      <option value="percent">%</option>
                      <option value="flat">{isPt ? 'Fixo' : 'Flat'}</option>
                    </select>
                    <Input type="number" min={0} value={c.value} onChange={(e) => updateCoupon(i, { value: parseFloat(e.target.value) || 0 })} />
                    <Input value={c.label} onChange={(e) => updateCoupon(i, { label: e.target.value.slice(0, 40) })} placeholder={isPt ? 'Rótulo' : 'Label'} />
                    <Button variant="ghost" size="icon" onClick={() => removeCoupon(i)} aria-label="Remove"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addCoupon} className="gap-1.5"><Plus className="h-3.5 w-3.5" /> {isPt ? 'Adicionar cupom' : 'Add coupon'}</Button>
              </div>
              <div className="mt-6 flex gap-3">
                <Button onClick={handleSave} className="gap-2"><Save className="h-4 w-4" /> {isPt ? 'Salvar' : 'Save'}</Button>
              </div>
            </section>

            <section className="rounded-lg border bg-card p-6">
              <h2 className="mb-1 text-lg font-semibold" style={{ fontFamily: theme.fonts.heading }}>{isPt ? 'Rastreamento' : 'Analytics'}</h2>
              <p className="mb-5 text-sm text-muted-foreground">{isPt ? 'Cole seus IDs; os scripts são injetados automaticamente.' : 'Paste your IDs — scripts are injected automatically.'}</p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Google Analytics (GA4) ID</Label>
                  <Input value={draft.gaId} onChange={(e) => setDraft({ ...draft, gaId: e.target.value.trim() })} placeholder="G-XXXXXXXXXX" />
                </div>
                <div className="space-y-1.5">
                  <Label>Meta Pixel ID</Label>
                  <Input value={draft.metaPixelId} onChange={(e) => setDraft({ ...draft, metaPixelId: e.target.value.trim() })} placeholder="1234567890" />
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <Button onClick={handleSave} className="gap-2"><Save className="h-4 w-4" /> {isPt ? 'Salvar' : 'Save'}</Button>
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
};

export default AdminPage;
