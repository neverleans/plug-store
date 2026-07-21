import { useEffect } from 'react';
import { useSiteConfig } from '@/contexts/SiteConfigContext';

/**
 * Injects Google Analytics (GA4) and Meta Pixel snippets when IDs are set in Settings.
 * Idempotent: won't inject the same tag twice; removes on unmount if IDs change.
 */
const AnalyticsInjector = () => {
  const { config } = useSiteConfig();
  const { gaId, metaPixelId } = config;

  useEffect(() => {
    if (!gaId) return;
    const s1id = 'ga-src';
    if (!document.getElementById(s1id)) {
      const s = document.createElement('script');
      s.id = s1id;
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(s);
    }
    const s2id = 'ga-init';
    let inline = document.getElementById(s2id) as HTMLScriptElement | null;
    if (!inline) {
      inline = document.createElement('script');
      inline.id = s2id;
      document.head.appendChild(inline);
    }
    inline.textContent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${gaId}');`;
    return () => {
      document.getElementById(s1id)?.remove();
      document.getElementById(s2id)?.remove();
    };
  }, [gaId]);

  useEffect(() => {
    if (!metaPixelId) return;
    const id = 'meta-pixel';
    let s = document.getElementById(id) as HTMLScriptElement | null;
    if (!s) {
      s = document.createElement('script');
      s.id = id;
      document.head.appendChild(s);
    }
    s.textContent = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaPixelId}');fbq('track','PageView');`;
    return () => { document.getElementById(id)?.remove(); };
  }, [metaPixelId]);

  return null;
};

export default AnalyticsInjector;
