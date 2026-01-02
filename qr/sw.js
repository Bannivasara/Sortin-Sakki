const cacheName = 'qr-v2';
const assets = [
  './',
  './index.html',
  './script.js',
  './manifest.json',
  './qrcode.min.js', // Lisää tämä heti kun olet luonut tiedoston!
  '../tyylit/style.css' // Tämä varmistaa, että ulkoasu säilyy offlinessa
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
