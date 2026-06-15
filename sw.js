const CACHE = "shifts-v2";
const ASSETS = [
  "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png",
  // on-device OCR bundle — precached so screenshot parsing works fully offline
  "./vendor/tesseract/tesseract.min.js",
  "./vendor/tesseract/worker.min.js",
  "./vendor/tesseract/tesseract-core-simd-lstm.wasm",
  "./vendor/tesseract/tesseract-core-simd-lstm.wasm.js",
  "./vendor/tesseract/tesseract-core-lstm.wasm",
  "./vendor/tesseract/tesseract-core-lstm.wasm.js",
  "./vendor/tesseract/eng.traineddata.gz"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => Promise.allSettled(ASSETS.map((a) => c.add(a)))));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

// network-first for navigations (so updates land), cache-first for assets, never cache API calls
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // let API calls pass through untouched
  if (e.request.mode === "navigate") {
    e.respondWith(fetch(e.request).catch(() => caches.match("./index.html")));
  } else {
    e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
  }
});
