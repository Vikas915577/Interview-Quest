/* Interview Quest service worker: resilient root/nested data paths and safe offline fallback. */
'use strict';
const CACHE_NAME = 'interview-quest-v2.2.0';
const CORE_FILES = ['./', './index.html', './style.css', './app.js', './manifest.webmanifest', './icon.svg'];
const OPTIONAL_DATA = ['./questions.json', './sources.json', './data/questions.json', './data/sources.json'];
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(CORE_FILES);
    await Promise.allSettled(OPTIONAL_DATA.map(async path => {
      try { const response = await fetch(path); if (response.ok) await cache.put(path, response.clone()); } catch (_) { /* The other layout may provide this JSON. */ }
    }));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('interview-quest-') && key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(response => {
      if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put('./index.html', response.clone()));
      return response;
    }).catch(async () => (await caches.match(request)) || (await caches.match('./index.html')) || Response.error()));
    return;
  }
  event.respondWith((async () => {
    const cached = await caches.match(request);
    try {
      const response = await fetch(request);
      if (response && response.ok) caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
      return response;
    } catch (_) {
      if (cached) return cached;
      // JSON gets an explicit machine-readable offline error; other missing assets must fail normally.
      if (/\.json$/i.test(url.pathname)) {
        return new Response(JSON.stringify({error:'Resource unavailable offline', path:url.pathname}), {
          status: 503, headers: {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}
        });
      }
      return Response.error();
    }
  })());
});
