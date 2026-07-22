import { CatalogApp } from '@neverleans/plug-store-core';
import type { IndustryTemplate } from '@neverleans/plug-store-core';
import { themeConfigs } from '@neverleans/plug-store-themes';
import ThemeGallery from './ThemeGallery';

const BASE = import.meta.env.BASE_URL;

/** The gallery links to ?theme=<id>; anything else renders the gallery itself. */
const selectedTheme = () => {
  const id = new URLSearchParams(window.location.search).get('theme');
  return id && id in themeConfigs ? id : null;
};

const BackToGallery = () => (
  <a
    href={BASE}
    className="fixed bottom-4 left-4 z-[60] rounded-full bg-slate-900/90 px-4 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur transition hover:bg-slate-900"
  >
    ← Todos os temas
  </a>
);

export default function App() {
  const themeId = selectedTheme();

  if (!themeId) {
    return <ThemeGallery />;
  }

  const theme = themeConfigs[themeId];

  return (
    <>
      <CatalogApp
        defaultTheme={themeId as IndustryTemplate}
        basename={BASE}
        config={{
          companyName: theme.name,
          currency: 'BRL',
          tagline: theme.tagline,
          whatsappPhone: '5511999999999',
          // Demo Pix key so the free-tier static Pix checkout is fully clickable.
          pixKey: 'contato@plugstore.dev',
          pixMerchantCity: 'Sao Paulo',
        }}
      />
      <BackToGallery />
    </>
  );
}
