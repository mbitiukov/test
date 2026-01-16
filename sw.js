const CACHE = "eyvi-v1";

const FILES = [
  "/",
  "/manifest.json",

  "/index.html",
  "/website/software.html",
  "/website/video.html",
  "/website/experimental.html",

  "/website/softprojects/project1.html",
  "/website/softprojects/project2.html",
  "/website/softprojects/project3.html",
  "/website/softprojects/project4.html",

  "/css/base.css",
  "/css/home.css",
  "/css/layout.css",
  "/css/software.css",
  "/css/project.css",

  "/js/main.js"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(FILES))
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
