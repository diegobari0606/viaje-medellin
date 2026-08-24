// Guarda la app para que abra sin señal. Los datos del viaje los cachea Firestore aparte.
const CACHE = "medellin-v3";
const BASICOS = [
  "./", "./index.html", "./manifest.json",
  "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png",
  "./fotos/medellin.jpg", "./fotos/comuna13.jpg", "./fotos/penol.jpg",
  "./fotos/parapente.jpg", "./fotos/pueblito.jpg", "./fotos/aeropuerto.jpg"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(BASICOS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const mismoOrigen = new URL(req.url).origin === location.origin;

  // La página siempre se busca en la red primero, para que los cambios lleguen.
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).catch(() => caches.match("./index.html")));
    return;
  }
  if (mismoOrigen) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req)));
  }
});
