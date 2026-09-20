const CACHE = 'playpicker-shell-v2';
const SHELL = ['./', './index.html', './styles.css', './activities.js', './i18n.js', './app.js', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/icon.svg'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)));
});
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if(event.request.method !== 'GET' || url.origin !== self.location.origin || !url.href.startsWith(self.registration.scope)) return;
  const shellURLs = SHELL.map(path => new URL(path, self.registration.scope).href);
  if(event.request.mode !== 'navigate' && !shellURLs.includes(url.href)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const response = await fetch(event.request);
      if(response.ok) await cache.put(event.request, response.clone());
      return response;
    } catch {
      const cached = await cache.match(event.request);
      if(cached) return cached;
      if(event.request.mode === 'navigate') return await cache.match(new URL('./', self.registration.scope));
      return Response.error();
    }
  })());
});
