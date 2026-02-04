const CACHE = "katalog-v2";

const FILES = [
  "./",
  "./index.html",
  "./manifest.json",

"./assets/logo-white-only.png",
"./assets/mask.png",
"./assets/plus.svg",

  "./script.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => {
      return cache.addAll(FILES);
    })
  );
});
//Delete cache
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});


self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
