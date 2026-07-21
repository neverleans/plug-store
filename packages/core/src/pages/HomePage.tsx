import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { getFeaturedProducts, getCategories } from '@/data';
import ProductCard from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import PageTransition from '@/components/common/PageTransition';
import SEOHead from '@/components/common/SEOHead';
import { safeImage, onImgError, safeCategoryImage, onCategoryImgError } from '@/lib/productImage';
import { localizeCategory, localizeTagline } from '@/i18n/dynamic';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const HeroFullwidth = ({ theme, t, language }: { theme: any; t: any; language: any }) => (
  <section className="relative min-h-[90vh] overflow-hidden">
    {/* Full-width background image with low contrast */}
    <div className="absolute inset-0 overflow-hidden">
      <img
        src={theme.heroImage || "/hero-fashion-bg.jpg"}
        alt="Fashion background"
        className="h-full w-full object-cover animate-ken-burns will-change-transform"
        style={{ filter: 'contrast(0.85) brightness(0.9)' }}
        width={1920}
        height={1080}
      />
      {/* Soft gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
    </div>

    {/* Content floating on top */}
    <div className="container relative z-10 mx-auto flex min-h-[90vh] flex-col items-center justify-center px-4 py-20 text-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-4xl"
      >
        {/* Season tag */}
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.5em' }}
          animate={{ opacity: 1, letterSpacing: '0.3em' }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-6 text-[11px] font-medium uppercase text-white/60"
        >
          {t.newCollection} — 2025
        </motion.p>

        {/* Main headline */}
        <h1
          className="mb-8 text-6xl font-light leading-[1.1] tracking-tight text-white md:text-8xl lg:text-9xl"
          style={{ fontFamily: theme.fonts.heading }}
        >
          <motion.span
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="block"
          >
            Elevate
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="block italic"
          >
            Your Style
          </motion.span>
        </h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mx-auto mb-10 max-w-lg text-base leading-relaxed text-white/70 md:text-lg"
        >
          {t.heroFashionDesc}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Link to="/products">
            <Button
              size="lg"
              className="gap-3 rounded-none bg-white px-10 text-xs font-medium uppercase tracking-[0.25em] text-foreground transition-all hover:bg-white/90 hover:shadow-2xl"
            >
              {t.shopNow}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link
            to="/about"
            className="group flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-white/70 transition-colors hover:text-white"
          >
            {t.learnMore}
            <span className="h-px w-8 bg-white/50 transition-all group-hover:w-12 group-hover:bg-white" />
          </Link>
        </motion.div>

        {/* Bottom decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="mx-auto mt-16 h-px w-24 bg-gradient-to-r from-transparent via-white/40 to-transparent"
        />

        {/* Brand meta */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-6 flex items-center justify-center gap-4 text-[10px] uppercase tracking-[0.4em] text-white/40"
        >
          <span>FW25</span>
          <span className="h-1 w-1 rounded-full bg-white/30" />
          <span>{theme.name}</span>
          <span className="h-1 w-1 rounded-full bg-white/30" />
          <span>Limited</span>
        </motion.div>
      </motion.div>
    </div>

    {/* Scroll indicator */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 1.2 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2"
    >
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="flex flex-col items-center gap-2 text-white/40"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <div className="h-8 w-px bg-gradient-to-b from-white/40 to-transparent" />
      </motion.div>
    </motion.div>
  </section>
);


/* ============================================================
 * Shared HeroBackground — full-bleed image with gradient overlay
 * ============================================================ */
const HeroBackground = ({
  src,
  overlay,
  filter = 'contrast(0.85) brightness(0.9)',
}: {
  src: string;
  overlay: string;
  filter?: string;
}) => (
  <div className="absolute inset-0 overflow-hidden">
    <img
      src={src}
      alt=""
      aria-hidden="true"
      className="h-full w-full object-cover animate-ken-burns will-change-transform"
      style={{ filter }}
      width={1920}
      height={1080}
    />
    <div className="absolute inset-0" style={{ background: overlay }} />
  </div>
);

/* ============================================================
 * Electronics — Split (cyan tech vibe)
 * ============================================================ */
const HeroSplit = ({ theme, t, language }: { theme: any; t: any; language: any }) => (
  <section className="relative min-h-[85vh] overflow-hidden">
    <HeroBackground
      src={theme.heroImage || "/hero-electronics-bg.jpg"}
      overlay={`linear-gradient(110deg, hsl(${theme.colors.heroGradientFrom} / 0.85) 0%, hsl(${theme.colors.heroGradientFrom} / 0.55) 50%, hsl(${theme.colors.heroGradientTo} / 0.45) 100%)`}
      filter="contrast(0.9) brightness(0.7) saturate(1.1)"
    />
    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(hsl(var(--accent) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--accent) / 0.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

    <div className="container relative z-10 mx-auto grid min-h-[85vh] items-center gap-8 px-4 py-20 lg:grid-cols-12">
      <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="lg:col-span-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          {t.latestTech}
        </div>
        <h1 className="mb-6 text-5xl font-bold leading-[1.05] text-white md:text-7xl lg:text-8xl" style={{ fontFamily: theme.fonts.heading, letterSpacing: '-0.02em' }}>
          {localizeTagline(theme.id, theme.tagline, language)}
        </h1>
        <p className="mb-8 max-w-xl text-lg text-white/80">{t.heroElectronicsDesc}</p>
        <div className="flex flex-wrap gap-3">
          <Link to="/products"><Button size="lg" className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">{t.explore} <ArrowRight className="h-5 w-5" /></Button></Link>
          <Link to="/products?category=deals"><Button size="lg" variant="outline" className="border-white/30 bg-white/5 text-white backdrop-blur-md hover:bg-white/15">{t.deals}</Button></Link>
        </div>
      </motion.div>
    </div>
  </section>
);

/* ============================================================
 * Food — Centered (organic warm)
 * ============================================================ */
const HeroCentered = ({ theme, t, language }: { theme: any; t: any; language: any }) => (
  <section className="relative min-h-[80vh] overflow-hidden">
    <HeroBackground
      src={theme.heroImage || "/hero-food-bg.jpg"}
      overlay={`linear-gradient(180deg, hsl(${theme.colors.heroGradientFrom} / 0.7) 0%, hsl(${theme.colors.heroGradientTo} / 0.6) 100%)`}
      filter="contrast(0.9) brightness(0.85) saturate(0.95)"
    />
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="container relative z-10 mx-auto flex min-h-[80vh] flex-col items-center justify-center px-4 py-20 text-center">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-white/80">— Farm to Table —</p>
      <h1 className="mb-6 max-w-3xl text-5xl font-bold leading-tight text-white md:text-7xl" style={{ fontFamily: theme.fonts.heading }}>{localizeTagline(theme.id, theme.tagline, language)}</h1>
      <p className="mx-auto mb-10 max-w-xl text-lg text-white/85">{t.heroFoodDesc}</p>
      <Link to="/products"><Button size="lg" className="gap-2 rounded-full bg-white px-10 text-base text-foreground hover:bg-white/90">{t.shopFresh} <ArrowRight className="h-5 w-5" /></Button></Link>
    </motion.div>
  </section>
);

/* ============================================================
 * Furniture — Overlay (warm minimalist interior)
 * ============================================================ */
const HeroOverlay = ({ theme, t, language }: { theme: any; t: any; language: any }) => (
  <section className="relative min-h-[85vh] overflow-hidden">
    <HeroBackground
      src={theme.heroImage || "/hero-furniture-bg.jpg"}
      overlay={`linear-gradient(105deg, hsl(${theme.colors.heroGradientFrom} / 0.85) 0%, hsl(${theme.colors.heroGradientFrom} / 0.5) 55%, transparent 100%)`}
      filter="contrast(0.9) brightness(0.95) saturate(0.95)"
    />
    <div className="container relative z-10 mx-auto flex min-h-[85vh] items-center px-4 py-20">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-2xl">
        <p className="mb-6 text-xs uppercase tracking-[0.4em] text-white/70">— {theme.name} —</p>
        <h1 className="mb-8 text-5xl leading-[1.05] text-white md:text-7xl lg:text-8xl" style={{ fontFamily: theme.fonts.heading }}>
          {localizeTagline(theme.id, theme.tagline, language)}
        </h1>
        <div className="mb-10 h-px w-16 bg-white/40" />
        <p className="mb-10 max-w-md text-lg text-white/80">{t.heroFurnitureDesc}</p>
        <Link to="/products"><Button size="lg" className="gap-2 rounded-none bg-white px-8 text-foreground hover:bg-white/90">{t.browseCollection} <ArrowRight className="h-5 w-5" /></Button></Link>
      </motion.div>
    </div>
  </section>
);

/* ============================================================
 * Beauty — Minimal (dreamy pastel)
 * ============================================================ */
const HeroMinimal = ({ theme, t, language }: { theme: any; t: any; language: any }) => (
  <section className="relative min-h-[80vh] overflow-hidden">
    <HeroBackground
      src={theme.heroImage || "/hero-beauty-bg.jpg"}
      overlay={`linear-gradient(160deg, hsl(${theme.colors.heroGradientFrom} / 0.55) 0%, hsl(${theme.colors.heroGradientTo} / 0.7) 100%)`}
      filter="contrast(0.85) brightness(0.95) saturate(1.05)"
    />
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="container relative z-10 mx-auto flex min-h-[80vh] flex-col items-center justify-center px-4 py-20 text-center">
      <p className="mb-6 text-sm font-light uppercase tracking-[0.5em] text-white/80">{t.luxury} · Beauty</p>
      <h1 className="mb-8 max-w-3xl text-5xl font-light leading-[1.1] text-white md:text-7xl lg:text-8xl" style={{ fontFamily: theme.fonts.heading }}>
        {localizeTagline(theme.id, theme.tagline, language)}
      </h1>
      <div className="mb-8 h-px w-24 bg-white/50" />
      <Link to="/products"><Button size="lg" variant="outline" className="rounded-none border-white/60 bg-white/10 px-12 tracking-[0.2em] text-white backdrop-blur-md hover:bg-white/20">{t.discover}</Button></Link>
    </motion.div>
  </section>
);

/* ============================================================
 * Sports — Energetic (high-impact runner)
 * ============================================================ */
const HeroEnergetic = ({ theme, t, language }: { theme: any; t: any; language: any }) => (
  <section className="relative min-h-[90vh] overflow-hidden bg-foreground text-background">
    <HeroBackground
      src="/hero-sports-bg.jpg"
      overlay={`linear-gradient(110deg, hsl(${theme.colors.heroGradientFrom} / 0.85) 0%, hsl(${theme.colors.heroGradientFrom} / 0.4) 50%, hsl(${theme.colors.heroGradientTo} / 0.6) 100%)`}
      filter="contrast(0.95) brightness(0.7) saturate(1.15)"
    />
    <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'repeating-linear-gradient(115deg, transparent 0 40px, rgba(255,255,255,0.2) 40px 42px)' }} />

    <div className="container relative z-10 mx-auto flex min-h-[90vh] flex-col justify-center px-4 py-20">
      <motion.div initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-4 inline-block bg-secondary px-3 py-1.5 text-xs font-black uppercase tracking-widest text-secondary-foreground"
        >
          {t.unleash || 'Unleash'} · Drop 03
        </motion.p>
        <h1 className="mb-6 text-6xl font-black uppercase leading-[0.85] text-white md:text-[8rem] lg:text-[10rem]" style={{ fontFamily: theme.fonts.heading, letterSpacing: '-0.03em' }}>
          {localizeTagline(theme.id, theme.tagline, language)}
        </h1>
        <p className="mb-10 max-w-md text-lg text-white/90">{t.heroSportsDesc || 'Built for athletes who refuse to settle.'}</p>
        <div className="flex flex-wrap gap-3">
          <Link to="/products"><Button size="lg" className="gap-2 rounded-none bg-white px-10 font-bold uppercase tracking-wider text-foreground hover:bg-white/90">{t.shopNow} <ArrowRight className="h-5 w-5" /></Button></Link>
          <Link to="/products?category=deals"><Button size="lg" variant="outline" className="rounded-none border-2 border-white bg-transparent px-10 font-bold uppercase tracking-wider text-white hover:bg-white/10">{t.deals}</Button></Link>
        </div>
        <div className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t-2 border-white/30 pt-6">
          {[
            { value: '+42%', label: 'Speed' },
            { value: '24h', label: 'Endure' },
            { value: 'Pro', label: 'Grade' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-black text-white" style={{ fontFamily: theme.fonts.heading }}>{stat.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>

    <div className="absolute bottom-0 left-0 right-0 z-10 overflow-hidden border-t-2 border-white/20 bg-black/40 py-3 backdrop-blur-sm">
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="flex whitespace-nowrap"
      >
        {Array.from({ length: 2 }).map((_, dup) => (
          <div key={dup} className="flex shrink-0 items-center gap-8 px-4 text-sm font-black uppercase tracking-widest text-white/80">
            {['Just Train', '★', 'No Limits', '★', 'Push Harder', '★', 'Beat Yesterday', '★', 'Pro Grade', '★', 'Engineered to Win', '★'].map((txt, i) => (
              <span key={`${dup}-${i}`}>{txt}</span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

/* ============================================================
 * Books — Editorial (vintage library)
 * ============================================================ */
const HeroEditorial = ({ theme, t, language }: { theme: any; t: any; language: any }) => (
  <section className="relative min-h-[85vh] overflow-hidden">
    <HeroBackground
      src={theme.heroImage || "/hero-books-bg.jpg"}
      overlay={`linear-gradient(100deg, hsl(${theme.colors.heroGradientFrom} / 0.85) 0%, hsl(${theme.colors.heroGradientFrom} / 0.55) 60%, hsl(${theme.colors.heroGradientTo} / 0.45) 100%)`}
      filter="contrast(0.85) brightness(0.85) sepia(0.15)"
    />
    <div className="container relative z-10 mx-auto flex min-h-[85vh] items-center px-4 py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="max-w-2xl">
        <p className="mb-6 text-xs font-medium uppercase tracking-[0.5em] text-white/60">— {t.editorial || "A Reader's Sanctuary"}</p>
        <h1 className="mb-8 text-5xl italic leading-[1.05] text-white md:text-7xl lg:text-8xl" style={{ fontFamily: theme.fonts.heading }}>
          {localizeTagline(theme.id, theme.tagline, language)}
        </h1>
        <div className="mb-10 max-w-md border-l-2 border-white/40 pl-5 text-lg italic text-white/80">
          "{t.heroBooksDesc || 'Curated volumes for the curious mind.'}"
        </div>
        <Link to="/products"><Button size="lg" variant="outline" className="rounded-none border-white/60 bg-white/5 px-8 italic text-white backdrop-blur-sm hover:bg-white/15">{t.browseShelf || 'Browse the shelf'} <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
      </motion.div>
    </div>
  </section>
);

/* ============================================================
 * Pets — Playful (puppy & kitten meadow)
 * ============================================================ */
const HeroPlayful = ({ theme, t, language }: { theme: any; t: any; language: any }) => (
  <section className="relative min-h-[85vh] overflow-hidden">
    <HeroBackground
      src="/hero-pets-bg.jpg"
      overlay={`linear-gradient(180deg, hsl(${theme.colors.heroGradientFrom} / 0.6) 0%, hsl(${theme.colors.heroGradientTo} / 0.55) 100%)`}
      filter="contrast(0.85) brightness(1) saturate(1.05)"
    />
    <svg className="absolute -bottom-1 left-0 right-0 z-10 w-full" viewBox="0 0 1440 100" preserveAspectRatio="none" style={{ height: 80 }}>
      <path d="M0,40 C320,100 720,0 1440,60 L1440,100 L0,100 Z" fill="hsl(var(--background))" />
    </svg>

    <div className="container relative z-10 mx-auto flex min-h-[85vh] flex-col items-center justify-center px-4 py-20 text-center">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }} className="mb-6 inline-block text-7xl drop-shadow-lg">🐶</motion.div>
        <h1 className="mb-6 max-w-3xl text-5xl font-extrabold leading-tight text-white drop-shadow-lg md:text-7xl lg:text-8xl" style={{ fontFamily: theme.fonts.heading }}>
          {localizeTagline(theme.id, theme.tagline, language)}
        </h1>
        <p className="mx-auto mb-10 max-w-lg text-lg text-white/95 drop-shadow">{t.heroPetsDesc || 'Treats, toys, and tail-wags for your best friend.'}</p>
        <Link to="/products"><Button size="lg" className="gap-2 rounded-full bg-white px-10 font-bold text-primary shadow-2xl transition-transform hover:scale-105 hover:bg-white/95">{t.shopNow} <ArrowRight className="h-5 w-5" /></Button></Link>
      </motion.div>
    </div>
  </section>
);

/* ============================================================
 * Automotive — Industrial (luxury sports car)
 * ============================================================ */
const HeroIndustrial = ({ theme, t, language }: { theme: any; t: any; language: any }) => (
  <section className="relative min-h-[90vh] overflow-hidden bg-background text-foreground">
    <HeroBackground
      src="/hero-automotive-bg.jpg"
      overlay={`linear-gradient(95deg, hsl(${theme.colors.heroGradientFrom} / 0.9) 0%, hsl(${theme.colors.heroGradientFrom} / 0.55) 50%, hsl(${theme.colors.heroGradientTo} / 0.5) 100%)`}
      filter="contrast(0.95) brightness(0.7) saturate(1.1)"
    />
    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

    <div className="container relative z-10 mx-auto flex min-h-[90vh] items-center px-4 py-20">
      <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-px w-12 bg-primary" />
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-primary">// {t.performance || 'Performance Series'}</p>
        </div>
        <h1 className="mb-6 text-6xl font-bold uppercase leading-[0.95] text-foreground md:text-8xl lg:text-9xl" style={{ fontFamily: theme.fonts.heading, letterSpacing: '-0.01em' }}>
          {localizeTagline(theme.id, theme.tagline, language)}
        </h1>
        <p className="mb-10 max-w-md text-lg text-foreground/80">{t.heroAutomotiveDesc || 'Track-grade components for serious drivers.'}</p>
        <div className="flex flex-wrap gap-3">
          <Link to="/products"><Button size="lg" className="gap-2 rounded-none px-10 font-bold uppercase tracking-wider">{t.configure || 'Configure'} <ArrowRight className="h-5 w-5" /></Button></Link>
          <Link to="/about"><Button size="lg" variant="outline" className="rounded-none border-foreground/60 bg-background/10 px-10 font-bold uppercase tracking-wider backdrop-blur-md">{t.specs || 'Specs'}</Button></Link>
        </div>
        <div className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-border/50 pt-6">
          <div><p className="text-2xl font-bold text-primary">+15%</p><p className="text-xs uppercase text-foreground/60">Power</p></div>
          <div><p className="text-2xl font-bold text-primary">-30%</p><p className="text-xs uppercase text-foreground/60">Weight</p></div>
          <div><p className="text-2xl font-bold text-primary">200mph</p><p className="text-xs uppercase text-foreground/60">Tested</p></div>
        </div>
      </motion.div>
    </div>
  </section>
);

/* ============================================================
 * Art — Gallery (museum interior)
 * ============================================================ */
const HeroGallery = ({ theme, t, language }: { theme: any; t: any; language: any }) => (
  <section className="relative min-h-[85vh] overflow-hidden bg-background">
    <HeroBackground
      src="/hero-art-bg.jpg"
      overlay={`linear-gradient(180deg, hsl(${theme.colors.heroGradientFrom} / 0.55) 0%, hsl(${theme.colors.heroGradientTo} / 0.7) 100%)`}
      filter="contrast(0.85) brightness(0.95) saturate(0.9)"
    />
    <div className="container relative z-10 mx-auto flex min-h-[85vh] items-center px-4 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="max-w-3xl">
        <p className="mb-6 text-xs uppercase tracking-[0.5em] text-foreground/70">— {theme.name} —</p>
        <h1 className="mb-8 text-5xl leading-[1.05] text-foreground md:text-7xl lg:text-8xl" style={{ fontFamily: theme.fonts.heading }}>
          {localizeTagline(theme.id, theme.tagline, language)}
        </h1>
        <div className="mb-8 h-px w-24 bg-foreground/40" />
        <p className="mb-10 max-w-lg text-lg text-foreground/75">A curated collection where every piece tells a story.</p>
        <Link to="/products" className="inline-flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-foreground transition-colors hover:text-accent">
          {t.viewCollection || 'View collection'}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    </div>
  </section>
);

const HomePage = () => {
  const { theme, template } = useTheme();
  const { t, language } = useLanguage();
  const featured = getFeaturedProducts(template);
  const categories = getCategories(template);

  const renderHero = () => {
    switch (theme.heroStyle) {
      case 'split': return <HeroSplit theme={theme} t={t} language={language} />;
      case 'centered': return <HeroCentered theme={theme} t={t} language={language} />;
      case 'overlay': return <HeroOverlay theme={theme} t={t} language={language} />;
      case 'minimal': return <HeroMinimal theme={theme} t={t} language={language} />;
      case 'energetic': return <HeroEnergetic theme={theme} t={t} language={language} />;
      case 'editorial': return <HeroEditorial theme={theme} t={t} language={language} />;
      case 'playful': return <HeroPlayful theme={theme} t={t} language={language} />;
      case 'industrial': return <HeroIndustrial theme={theme} t={t} language={language} />;
      case 'gallery': return <HeroGallery theme={theme} t={t} language={language} />;
      default: return <HeroFullwidth theme={theme} t={t} language={language} />;
    }
  };

  return (
    <PageTransition>
      <SEOHead
        title={`${theme.name} — Premium ${template} Store`}
        description={`Shop the best ${template} products. ${localizeTagline(theme.id, theme.tagline, language)}`}
      />

      {renderHero()}

      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-8 text-center text-3xl font-bold" style={{ fontFamily: theme.fonts.heading }}>{t.shopByCategory}</h2>
        <motion.div key={`cats-${template}`} variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(cat => (
            <motion.div key={cat.id} variants={item}>
              <Link to={`/products?category=${cat.slug}`} className="group relative block aspect-[16/9] overflow-hidden rounded-xl">
                <img src={safeCategoryImage(cat.image)} onError={onCategoryImgError} alt={localizeCategory(cat.name, language)} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4"><h3 className="text-lg font-bold text-white">{localizeCategory(cat.name, language)}</h3></div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold" style={{ fontFamily: theme.fonts.heading }}>{t.featuredProducts}</h2>
            <Link to="/products" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">{t.viewAll} <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <motion.div key={`feat-${template}`} variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.slice(0, 4).map(product => (
              <motion.div key={product.id} variants={item}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid gap-8 text-center sm:grid-cols-3">
          {[
            { icon: Truck, title: t.freeShipping, desc: t.freeShippingDesc },
            { icon: Shield, title: t.securePayments, desc: t.securePaymentsDesc },
            { icon: RefreshCw, title: t.thirtyDayReturns, desc: t.thirtyDayReturnsDesc },
          ].map(({ icon: Icon, title, desc }) => (
            <motion.div key={title} variants={item} className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"><Icon className="h-6 w-6 text-primary" /></div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold" style={{ fontFamily: theme.fonts.heading }}>{t.stayInTheLoop}</h2>
          <p className="mb-6 text-primary-foreground/80">{t.newsletterDesc}</p>
          <form onSubmit={(e) => e.preventDefault()} className="mx-auto flex max-w-md gap-2">
            <input type="email" placeholder={t.enterEmail} className="flex-1 rounded-md bg-primary-foreground/10 px-4 py-2 text-sm text-primary-foreground placeholder:text-primary-foreground/50 outline-none" />
            <Button variant="secondary">{t.subscribe}</Button>
          </form>
        </div>
      </section>
    </PageTransition>
  );
};

export default HomePage;
