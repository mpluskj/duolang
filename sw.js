/* DuoLang service worker — offline shell with network-first updates */
const CACHE = "duolang-v5";
const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./css/style.css",
  "./js/data/beginner-a.js",
  "./js/data/beginner-b.js",
  "./js/data/intermediate-a.js",
  "./js/data/intermediate-b.js",
  "./js/data/advanced-a.js",
  "./js/data/advanced-b.js",
  "./js/data/situations.js",
  "./js/data/course.js",
  "./js/core/speech.js",
  "./js/core/store.js",
  "./js/core/gemini.js",
  "./js/core/exercises.js",
  "./js/lesson.js",
  "./js/views.js",
  "./js/app.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(SHELL))
      .catch(() => {})
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.status === 200 && res.type === "basic") {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() =>
        caches.match(req).then((hit) => {
          if (hit) return hit;
          if (req.mode === "navigate") return caches.match("./index.html");
          return new Response("Offline", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } });
        })
      )
  );
});
