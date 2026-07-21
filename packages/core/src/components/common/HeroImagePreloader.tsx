import { useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { IndustryTemplate } from '@/types';

// Map of industry template -> hero background image path.
// Keep in sync with the backgrounds used in HomePage.tsx.
const HERO_IMAGES: Record<string, string> = {
  fashion: '/hero-fashion-bg.jpg',
  electronics: '/hero-electronics-bg.jpg',
  food: '/hero-food-bg.jpg',
  furniture: '/hero-furniture-bg.jpg',
  beauty: '/hero-beauty-bg.jpg',
  sports: '/hero-sports-bg.jpg',
  books: '/hero-books-bg.jpg',
  pets: '/hero-pets-bg.jpg',
  automotive: '/hero-automotive-bg.jpg',
  art: '/hero-art-bg.jpg',
  jewelry: '/hero-jewelry-bg.jpg',
  homeware: '/hero-homeware-bg.jpg',
  market: '/hero-market-bg.jpg',
  wellness: '/hero-wellness-bg.jpg',
  stationery: '/hero-stationery-bg.jpg',
};

// Order used to determine "adjacency" for the second preload tier.
const TEMPLATE_ORDER: IndustryTemplate[] = [
  'fashion',
  'electronics',
  'food',
  'furniture',
  'beauty',
  'sports',
  'books',
  'pets',
  'automotive',
  'art',
  'jewelry',
  'homeware',
  'market',
  'wellness',
  'stationery',
];

const PRELOAD_LINK_ID = 'hero-active-preload';
const ADJACENT_LINK_PREFIX = 'hero-adjacent-preload-';

// Module-level state so we don't re-fetch images we've already loaded
// during the session (survives component remounts).
const completed = new Set<string>();
const inFlight = new Map<string, AbortController>();

type Priority = 'high' | 'low' | 'auto';

/**
 * Fetch an image with a real, cancelable network request. Uses fetch +
 * AbortController so that when the theme changes mid-flight we can actually
 * tear down the in-progress download instead of letting it run to completion
 * in the background.
 *
 * The response body is discarded — we only care that the bytes land in the
 * HTTP cache so the next <img src=...> render is instant.
 */
const fetchImage = async (src: string, priority: Priority, signal: AbortSignal): Promise<void> => {
  if (completed.has(src)) return;

  // If a fetch for this src is already in flight, await its completion
  // (or cancellation) instead of starting a duplicate request.
  const existing = inFlight.get(src);
  if (existing) {
    await new Promise<void>((resolve) => {
      const onAbort = () => resolve();
      existing.signal.addEventListener('abort', onAbort, { once: true });
      const check = window.setInterval(() => {
        if (completed.has(src) || !inFlight.has(src)) {
          window.clearInterval(check);
          existing.signal.removeEventListener('abort', onAbort);
          resolve();
        }
      }, 50);
    });
    return;
  }

  const controller = new AbortController();
  inFlight.set(src, controller);

  // Bridge the caller's signal into our controller so cancellation
  // propagates to the underlying fetch.
  const onParentAbort = () => controller.abort();
  if (signal.aborted) controller.abort();
  else signal.addEventListener('abort', onParentAbort, { once: true });

  try {
    const res = await fetch(src, {
      signal: controller.signal,
      // @ts-ignore - priority is a valid RequestInit field in modern browsers
      priority: priority === 'auto' ? undefined : priority,
      credentials: 'same-origin',
      cache: 'force-cache',
    });
    // Drain the body so the browser fully commits it to the HTTP cache.
    await res.blob();
    completed.add(src);
  } catch {
    // Aborted or network error — leave it un-completed so a future tier
    // can retry it.
  } finally {
    signal.removeEventListener('abort', onParentAbort);
    inFlight.delete(src);
  }
};

const requestIdle = (cb: () => void, timeout = 2000): number => {
  // @ts-ignore - requestIdleCallback not in all TS lib targets
  if (typeof window.requestIdleCallback === 'function') {
    // @ts-ignore
    return window.requestIdleCallback(cb, { timeout });
  }
  return window.setTimeout(cb, 200);
};

const cancelIdle = (id: number) => {
  // @ts-ignore
  if (typeof window.cancelIdleCallback === 'function') {
    // @ts-ignore
    window.cancelIdleCallback(id);
  } else {
    window.clearTimeout(id);
  }
};

/**
 * Layered preloading strategy with real request cancellation:
 *  Tier 1 (immediate, high priority): active theme's hero image.
 *  Tier 2 (after Tier 1, low priority): the two adjacent themes.
 *  Tier 3 (during idle, auto priority): remaining themes, staggered.
 *
 * When the theme changes, the AbortController for the previous tier work
 * is fired, which:
 *   - aborts any in-flight fetch() for non-active hero images
 *   - cancels pending idle callbacks and timeouts
 *   - lets the new effect run start a fresh layered fetch around the new theme
 */
const HeroImagePreloader = () => {
  const { template } = useTheme();
  const tier3HandlesRef = useRef<number[]>([]);
  const tier3TimeoutsRef = useRef<number[]>([]);

  // Tier 1: keep a high-priority <link rel="preload"> in sync with the
  // active theme so the browser prioritizes the asset during a swap.
  useEffect(() => {
    const href = HERO_IMAGES[template];
    if (!href) return;

    let link = document.getElementById(PRELOAD_LINK_ID) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.id = PRELOAD_LINK_ID;
      link.rel = 'preload';
      link.as = 'image';
      document.head.appendChild(link);
    }
    link.href = href;
    // @ts-ignore - fetchPriority is supported in modern browsers
    link.fetchPriority = 'high';
  }, [template]);

  // Layered fetch: Tier 1 -> Tier 2 -> Tier 3, with real cancellation.
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    // Cancel any pending Tier 3 idle handles / timeouts from the previous
    // theme so we can re-prioritize around the new active theme.
    tier3HandlesRef.current.forEach(cancelIdle);
    tier3HandlesRef.current = [];
    tier3TimeoutsRef.current.forEach((id) => window.clearTimeout(id));
    tier3TimeoutsRef.current = [];

    const activeSrc = HERO_IMAGES[template];
    const idx = TEMPLATE_ORDER.indexOf(template);
    const adjacent: string[] = [];
    if (idx !== -1) {
      const prev = TEMPLATE_ORDER[(idx - 1 + TEMPLATE_ORDER.length) % TEMPLATE_ORDER.length];
      const next = TEMPLATE_ORDER[(idx + 1) % TEMPLATE_ORDER.length];
      adjacent.push(HERO_IMAGES[prev], HERO_IMAGES[next]);
    }
    const rest = Object.values(HERO_IMAGES).filter(
      (src) => src !== activeSrc && !adjacent.includes(src)
    );

    // Remove stale adjacent <link> tags from a prior theme.
    document.querySelectorAll(`link[id^="${ADJACENT_LINK_PREFIX}"]`).forEach((el) => el.remove());

    const run = async () => {
      // Tier 1: active theme, high priority.
      await fetchImage(activeSrc, 'high', signal);
      if (signal.aborted) return;

      // Tier 2: adjacent themes, low priority + <link rel="preload"> hint.
      adjacent.forEach((src, i) => {
        const link = document.createElement('link');
        link.id = `${ADJACENT_LINK_PREFIX}${i}`;
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        // @ts-ignore
        link.fetchPriority = 'low';
        document.head.appendChild(link);
      });
      await Promise.all(adjacent.map((src) => fetchImage(src, 'low', signal)));
      if (signal.aborted) return;

      // Tier 3: remaining themes, staggered during idle time.
      rest.forEach((src, i) => {
        const handle = requestIdle(() => {
          if (signal.aborted) return;
          const t = window.setTimeout(() => {
            if (signal.aborted) return;
            fetchImage(src, 'auto', signal);
          }, i * 150);
          tier3TimeoutsRef.current.push(t);
        }, 3000);
        tier3HandlesRef.current.push(handle);
      });
    };

    run();

    return () => {
      // Aborts in-flight fetches for non-active heroes and short-circuits
      // the tier pipeline so no further work runs for the old theme.
      controller.abort();
      tier3HandlesRef.current.forEach(cancelIdle);
      tier3HandlesRef.current = [];
      tier3TimeoutsRef.current.forEach((id) => window.clearTimeout(id));
      tier3TimeoutsRef.current = [];
    };
  }, [template]);

  return null;
};

export default HeroImagePreloader;
