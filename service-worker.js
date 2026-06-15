// The cache name includes a version number.
// When you update the app, bump this version (e.g. 'calculator-v2') and
// the old cache will be deleted and replaced with fresh files.
const CACHE_NAME = 'calculator-v1';

// Every file the app needs to work offline must be listed here.
const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/icon.svg',
  '/manifest.json',
];

// ── Install ───────────────────────────────────────────────────────────────────
//
// Fires once when the service worker is first registered.
// We open (or create) the cache and store every asset in it.
// event.waitUntil() tells the browser "don't finish installing until this
// promise resolves" — so the app won't be considered ready until all files
// are cached.

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(ASSETS);
    })
  );
});

// ── Activate ──────────────────────────────────────────────────────────────────
//
// Fires after install, once the old service worker (if any) has been replaced.
// We delete any caches from older versions so stale files don't pile up.

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys
          .filter(function (key) { return key !== CACHE_NAME; })
          .map(function (key) { return caches.delete(key); })
      );
    })
  );
});

// ── Fetch ─────────────────────────────────────────────────────────────────────
//
// Fires on every network request the page makes.
// Strategy: Cache First — serve from cache if available, otherwise fetch
// from the network. For a static app like this, cached files never change
// between versions (the version bump in CACHE_NAME handles updates).

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      return cached || fetch(event.request);
    })
  );
});
