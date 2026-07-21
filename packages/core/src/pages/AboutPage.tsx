import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Store, Heart, Shield } from 'lucide-react';
import { localizeTagline } from '@/i18n/dynamic';

const AboutPage = () => {
  const { theme, template } = useTheme();
  const { t, language } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="mb-4 text-4xl font-bold" style={{ fontFamily: theme.fonts.heading }}>{t.aboutTitle} {theme.name}</h1>
        <p className="mb-12 text-lg text-muted-foreground">{localizeTagline(template, theme.tagline, language)} {t.aboutDesc}</p>
      </div>

      <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
        {[
          { icon: Store, title: t.ourStory, text: t.ourStoryDesc },
          { icon: Heart, title: t.ourValues, text: t.ourValuesDesc },
          { icon: Shield, title: t.ourPromise, text: t.ourPromiseDesc },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-xl border bg-card p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"><Icon className="h-6 w-6 text-primary" /></div>
            <h3 className="mb-2 font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutPage;
