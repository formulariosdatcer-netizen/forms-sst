const CACHE = 'sst-datcer-v9';

const ASSETS = [
  './index.html',
  './form.html',
  './admin.html',
  './firma.html',
  './sst-design-templates.html',
  './manifest.json',
  './css/app.css',
  './js/config.js',
  './js/db.js',
  './js/index.js',
  './js/form.js',
  './js/admin.js',
  './js/pdf.js',
  './js/pdf-forms.js',
  './js/forms/fr-sst-36.js',
  './js/forms/fr-sst-37.js',
  './js/forms/fr-sst-38.js',
  './js/forms/fr-sst-39.js',
  './js/forms/fr-sst-40.js',
  './js/forms/fr-sst-41.js',
  './js/forms/fr-sst-42.js',
  './js/forms/fr-sst-43.js',
  './js/forms/fr-sst-44.js',
  './js/forms/fr-sst-45.js',
  './js/forms/fr-sst-46.js',
  './js/forms/fr-sst-47.js',
  './js/forms/fr-sst-48.js',
  './js/forms/fr-sst-49.js',
  './js/forms/fr-sst-50.js',
  './js/forms/fr-sst-51.js',
  './js/forms/fr-sst-52.js',
  './js/forms/fr-sst-53.js',
  './js/forms/fr-sst-54.js',
  './js/forms/fr-sst-55.js',
  './js/forms/fr-sst-56.js',
  './icons/logo.png',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('supabase.co')) return;

  const isCDN = /jsdelivr|cloudflare|cdnjs/.test(e.request.url);

  if (isCDN) {
    // CDN libraries: cache-first (nunca cambian)
    e.respondWith(
      caches.match(e.request).then(cached => cached ||
        fetch(e.request).then(res => {
          if (res.ok) caches.open(CACHE).then(c => c.put(e.request, res.clone()));
          return res;
        })
      )
    );
  } else {
    // Archivos propios: network-first (siempre descarga lo nuevo, caché si no hay internet)
    e.respondWith(
      fetch(e.request).then(res => {
        if (res.ok) caches.open(CACHE).then(c => c.put(e.request, res.clone()));
        return res;
      }).catch(() => caches.match(e.request))
    );
  }
});
