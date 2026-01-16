const CACHE = "eyvi-v1";

const FILES = [
  "./",
  "./index.html",
  "./manifest.json",

  "./website/software.html",
  "./website/video.html",
  "./website/experimental.html",

  "./website/softprojects/project1.html",
  "./website/softprojects/project2.html",
  "./website/softprojects/project3.html",
  "./website/softprojects/project4.html",

  "./css/base.css",
  "./css/home.css",
  "./css/layout.css",
  "./css/software.css",
  "./css/project.css",

  "./js/main.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => {
      return cache.addAll(FILES);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
