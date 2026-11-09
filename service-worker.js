const CACHE_NAME = "schoko-tetris-v3";

const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./sketch.js",
  "./manifest.json",
  "./icon.svg",
  "./icon-180.png",
  "./schoki-vollmilch.png",
  "./schoki-dunkel.png",
  "./schoki-weiss.png",
  "https://cdn.jsdelivr.net/npm/p5@2.3.4/lib/p5.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.all(
        ASSETS.map(url =>
          cache.add(url).catch(error => {
            console.warn("Datei konnte nicht gespeichert werden:", url, error);
          })
        )
      )
    )
  );

  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
