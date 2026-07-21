const CACHE_NAME = 'plug-store-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/placeholder.svg',
  '/favicon.ico',
];

// Install event: Pre-cache static shell assets
self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  (self as any).skipWaiting();
});

// Activate event: Clean old caches
self.addEventListener('activate', (event: any) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  (self as any).clients.claim();
});

// Fetch event: Network-first strategy with offline cache fallback
self.addEventListener('fetch', (event: any) => {
  const req = event.request;

  // Only handle GET requests
  if (req.method !== 'GET') return;

  // Exclude non-http(s) requests
  if (!req.url.startsWith('http')) return;

  event.respondWith(
    fetch(req)
      .then((networkResponse) => {
        // Cache valid HTTP 200 responses dynamically for offline mode
        if (networkResponse && networkResponse.status === 200) {
          const resClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, resClone);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        // Fallback to cache when offline
        const cachedResponse = await caches.match(req);
        if (cachedResponse) {
          return cachedResponse;
        }

        // Return offline HTML shell fallback for navigation requests
        if (req.mode === 'navigate') {
          const offlineShell = await caches.match('/index.html');
          if (offlineShell) return offlineShell;
        }

        return new Response('Offline — PlugStore Catalog', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({ 'Content-Type': 'text/plain; charset=utf-8' }),
        });
      })
  );
});
