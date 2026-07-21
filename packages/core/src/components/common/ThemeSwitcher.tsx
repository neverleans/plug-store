import { useRef, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { IndustryTemplate } from '@/types';
import { Palette } from 'lucide-react';
import { templateLabels, localizeTemplate } from '@/i18n/dynamic';

const ThemeSwitcher = () => {
  const { template, setTemplate } = useTheme();
  const { t, language } = useLanguage();
  const [open, setOpen] = useState(false);
  const closeTimeoutRef = useRef<number | null>(null);

  const handleOpen = () => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpen(true);
  };

  const handleClose = () => {
    closeTimeoutRef.current = window.setTimeout(() => {
      setOpen(false);
      closeTimeoutRef.current = null;
    }, 120);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className="flex flex-col items-end"
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
      >
        {open && (
          <div className="mb-2 max-h-[60vh] w-56 overflow-y-auto rounded-lg border bg-card p-2 shadow-xl animate-fade-in">
            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.switchTemplate}
            </p>
            {(Object.keys(templateLabels) as IndustryTemplate[]).map((key) => (
              <button
                key={key}
                onClick={() => {
                  setTemplate(key);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                  template === key ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                }`}
              >
                <span>{templateLabels[key].emoji}</span>
                <span>{localizeTemplate(key, language)}</span>
              </button>
            ))}
          </div>
        )}

        <button
          type="button"
          aria-label="Switch store template"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110"
        >
          <Palette className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default ThemeSwitcher;
