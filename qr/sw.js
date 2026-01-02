const cacheName = 'qr-v1';
const assets = [
  './',
  './index.html',
  './script.js',
  './tyylit/style.css'
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
