import { Link } from 'react-router-dom';
import { Instagram, Facebook, MessageCircle, Music2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteConfig } from '@/contexts/SiteConfigContext';
import { getCategories } from '@/data';
import { localizeCategory, localizeTagline } from '@/i18n/dynamic';

const Footer = () => {
  const { theme, template } = useTheme();
  const { t, language } = useLanguage();
  const { config } = useSiteConfig();
  const categories = getCategories(template);
  const brandName = config.companyName || theme.name;
  const tagline = config.tagline || localizeTagline(template, theme.tagline, language);

  const waHref = config.whatsappPhone ? `https://wa.me/${config.whatsappPhone.replace(/\D/g, '')}` : '';
  const socials = [
    { href: config.instagramUrl, icon: Instagram, label: 'Instagram' },
    { href: config.tiktokUrl, icon: Music2, label: 'TikTok' },
    { href: config.facebookUrl, icon: Facebook, label: 'Facebook' },
    { href: waHref, icon: MessageCircle, label: 'WhatsApp' },
  ].filter((s) => !!s.href);

  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              {config.logoDataUrl && (
                <img src={config.logoDataUrl} alt="" className="h-8 w-8 rounded object-contain" />
              )}
              <h3 className="text-lg font-bold" style={{ fontFamily: theme.fonts.heading }}>{brandName}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{tagline}.</p>
            {(config.contactEmail || config.contactPhone || config.address) && (
              <div className="mt-4 space-y-1 text-xs text-muted-foreground">
                {config.contactEmail && <p>{config.contactEmail}</p>}
                {config.contactPhone && <p>{config.contactPhone}</p>}
                {config.address && <p>{config.address}</p>}
              </div>
            )}
            {socials.length > 0 && (
              <div className="mt-4 flex gap-2">
                {socials.map(({ href, icon: Icon, label }) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider">{t.shop}</h4>
            <ul className="space-y-2">
              {categories.slice(0, 5).map(cat => (
                <li key={cat.id}><Link to={`/products?category=${cat.slug}`} className="text-sm text-muted-foreground hover:text-foreground">{localizeCategory(cat.name, language)}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider">{t.company}</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">{t.aboutUs}</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">{t.contact}</Link></li>
              <li><span className="text-sm text-muted-foreground">{t.careers}</span></li>
              <li><span className="text-sm text-muted-foreground">{t.press}</span></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider">{t.support}</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-muted-foreground">{t.shippingReturns}</span></li>
              <li><span className="text-sm text-muted-foreground">{t.faq}</span></li>
              <li><span className="text-sm text-muted-foreground">{t.sizeGuide}</span></li>
              <li><span className="text-sm text-muted-foreground">{t.privacyPolicy}</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
          {config.footerText || `© 2026 ${brandName}. ${t.allRightsReserved}`}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
