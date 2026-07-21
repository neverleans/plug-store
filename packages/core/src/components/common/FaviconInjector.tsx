import { useEffect } from 'react';
import { useSiteConfig } from '@/contexts/SiteConfigContext';

/** Swaps the site favicon whenever the user uploads one in Settings. */
const FaviconInjector = () => {
  const { config } = useSiteConfig();
  useEffect(() => {
    if (!config.faviconDataUrl) return;
    let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    const prev = link.href;
    link.type = 'image/png';
    link.href = config.faviconDataUrl;
    return () => { if (prev) link!.href = prev; };
  }, [config.faviconDataUrl]);
  return null;
};

export default FaviconInjector;
