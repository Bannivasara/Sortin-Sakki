const cacheName = 'qr-v4';
const assets = [
  './',
  './index.html',
  './script.js',
  './manifest.json',
  './qrcode.min.js',
  './icon-512.png',           // Tämän on oltava sama kuin kansion tiedostonimi
  '../tyylit/style.css'
];


// Asennusvaihe: Tallennetaan tiedostot välimuistiin
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// Pyyntöjen kaappaus: Haetaan tiedostot välimuistista jos nettiä ei ole
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
