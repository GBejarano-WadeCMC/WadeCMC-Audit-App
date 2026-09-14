const CACHE = 'wade-audits-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './templates/5s.json',
  './templates/hs.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './assets/wade-logo.png',
  './assets/wade-mark.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Cache-first: once installed, the app works with zero connection.
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((cache) => cache.put(e.request, copy));
        return res;
      }).catch(() => cached);
    })
  );
});
