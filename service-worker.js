const CACHE_NAME = "optikon-v1";

self.addEventListener("install", event => {
    self.skipWaiting();
});

self.addEventListener("activate", event => {
    event.waitUntil(clients.claim());
});

self.addEventListener("fetch", event => {
    // Network first: safest for your test system
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    );
});