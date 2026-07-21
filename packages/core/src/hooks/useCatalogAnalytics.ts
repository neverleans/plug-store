import { useEffect } from 'react';
import { useSiteConfig } from '@/contexts/SiteConfigContext';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
  }
}

/**
 * Helper utility to track standard e-commerce events across GA4 and Meta Pixel zero-config
 */
export const trackEvent = (
  eventName: 'view_item' | 'add_to_cart' | 'begin_checkout' | 'purchase',
  params?: Record<string, any>
) => {
  if (typeof window === 'undefined') return;

  // Google Analytics 4
  if (window.gtag) {
    window.gtag('event', eventName, params);
  }

  // Meta Pixel
  if (window.fbq) {
    const pixelEvents: Record<string, string> = {
      view_item: 'ViewContent',
      add_to_cart: 'AddToCart',
      begin_checkout: 'InitiateCheckout',
      purchase: 'Purchase',
    };
    const fbEvent = pixelEvents[eventName];
    if (fbEvent) {
      window.fbq('track', fbEvent, params);
    }
  }
};

export const useCatalogAnalytics = () => {
  const { config } = useSiteConfig();

  useEffect(() => {
    if (!config.gaId && !config.metaPixelId) return;

    // GA4 setup
    if (config.gaId && !document.getElementById('ga-script')) {
      const script = document.createElement('script');
      script.id = 'ga-script';
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${config.gaId}`;
      document.head.appendChild(script);

      const inlineScript = document.createElement('script');
      inlineScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${config.gaId}');
      `;
      document.head.appendChild(inlineScript);
    }

    // Meta Pixel setup
    if (config.metaPixelId && !document.getElementById('meta-pixel-script')) {
      const script = document.createElement('script');
      script.id = 'meta-pixel-script';
      script.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${config.metaPixelId}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(script);
    }
  }, [config.gaId, config.metaPixelId]);

  return { trackEvent };
};
