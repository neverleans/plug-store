import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Mode = 'light' | 'dark';

interface Ctx {
  mode: Mode;
  toggle: () => void;
  setMode: (m: Mode) => void;
}

const ColorModeContext = createContext<Ctx | undefined>(undefined);

const KEY = 'ecom-color-mode';

export const ColorModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<Mode>(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = localStorage.getItem(KEY) as Mode | null;
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    try { localStorage.setItem(KEY, mode); } catch {}
  }, [mode]);

  const toggle = () => setMode((m) => (m === 'dark' ? 'light' : 'dark'));

  return (
    <ColorModeContext.Provider value={{ mode, toggle, setMode }}>
      {children}
    </ColorModeContext.Provider>
  );
};

export const useColorMode = () => {
  const ctx = useContext(ColorModeContext);
  if (!ctx) throw new Error('useColorMode must be used within ColorModeProvider');
  return ctx;
};
