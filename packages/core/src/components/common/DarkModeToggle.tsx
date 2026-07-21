import { Moon, Sun } from 'lucide-react';
import { useColorMode } from '@/contexts/ColorModeContext';
import { useLanguage } from '@/contexts/LanguageContext';

const DarkModeToggle = () => {
  const { mode, toggle } = useColorMode();
  const { t } = useLanguage();
  const isDark = mode === 'dark';
  return (
    <button
      onClick={toggle}
      aria-label={isDark ? t.lightMode : t.darkMode}
      title={isDark ? t.lightMode : t.darkMode}
      className="flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-muted"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
};

export default DarkModeToggle;
