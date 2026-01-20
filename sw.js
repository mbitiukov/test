const CACHE = "eyvi-v11";

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

  "./assets/icons/logo192.png",
"./assets/icons/logo512.png",

"./assets/images/banner.jpg",
"./assets/images/software.jpg",
"./assets/images/experimental.jpg",
"./assets/images/video.jpg",
"./assets/images/p1.jpg",
"./assets/images/p2.jpg",
"./assets/images/p3.jpg",
"./assets/images/p4.jpg",
"./assets/icons/back.svg",

"./fonts/ppneuebit-bold.otf",
"./fonts/ppmonowest-regular.otf",


  "./js/main.js"
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
