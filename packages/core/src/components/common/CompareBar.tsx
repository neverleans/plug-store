import { Link } from 'react-router-dom';
import { X, GitCompare, ArrowRight } from 'lucide-react';
import { useCompare } from '@/contexts/CompareContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { safeImage, onImgError } from '@/lib/productImage';

const CompareBar = () => {
  const { items, remove, clear } = useCompare();
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {items.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-0 left-0 right-0 z-30 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85 shadow-2xl"
          role="region"
          aria-label="Compare bar"
        >
          <div className="container mx-auto flex flex-wrap items-center gap-3 px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <GitCompare className="h-4 w-4 text-primary" />
              {t.compare} ({items.length}/4)
            </div>

            <div className="flex flex-1 flex-wrap gap-2">
              {items.map((p) => (
                <div key={p.id} className="group relative">
                  <img src={safeImage(p.images[0])} onError={onImgError} alt={p.name} className="h-12 w-12 rounded-md object-cover" />
                  <button
                    onClick={() => remove(p.id)}
                    aria-label={`Remove ${p.name}`}
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background opacity-90 transition hover:scale-110"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>

            <Button variant="ghost" size="sm" onClick={clear}>{t.clearCart}</Button>
            <Link to="/compare">
              <Button size="sm" className="gap-2">{t.comparison} <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CompareBar;
