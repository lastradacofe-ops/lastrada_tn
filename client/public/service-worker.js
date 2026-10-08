const SHELL_CACHE = 'lastrada-app-shell-v2';
const MENU_API_CACHE = 'lastrada-api-menu-v1';
const SHELL_ASSETS = ['./', './manifest.webmanifest', './pwa-icon-192.svg', './pwa-icon-512.svg', './lastrada-hero.jpg'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(SHELL_CACHE).then(cache => cache.addAll(SHELL_ASSETS)).catch(() => undefined));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key !== SHELL_CACHE && key !== MENU_API_CACHE).map(key => caches.delete(key)),
  )));
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Future API adapter may request this same-origin endpoint. The demo UI
  // deliberately does not make this request; when used, it is network-first.
  if (url.pathname === '/api/menu') {
    event.respondWith(fetch(request).then(response => {
      if (response.ok) caches.open(MENU_API_CACHE).then(cache => cache.put(request, response.clone()));
      return response;
    }).catch(() => caches.match(request).then(cached => cached || new Response(
      JSON.stringify({ error: 'Menu unavailable offline' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } },
    ))));
    return;
  }

  // App shell: network first while connected, cached shell on offline visits.
  event.respondWith(fetch(request).then(response => {
    if (response.ok) {
      caches.open(SHELL_CACHE).then(cache => cache.put(request, response.clone()));
    }
    return response;
  }).catch(() => caches.match(request).then(cached => cached || (
    request.mode === 'navigate' ? caches.match('./') : undefined
  ))));
});
