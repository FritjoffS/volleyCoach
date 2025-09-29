// Service Worker för PWA-funktionalitet
const CACHE_NAME = 'volleycoach-v1.1.0';
const urlsToCache = [
  '/volleyCoach/',
  '/volleyCoach/index.html',
  '/volleyCoach/css/style.css',
  '/volleyCoach/js/main.js',
  '/volleyCoach/js/ui.js',
  '/volleyCoach/js/database.js',
  '/volleyCoach/js/firebase-config.js',
  '/volleyCoach/manifest.json',
  '/volleyCoach/icon.png'
];

// Installera Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Installed');
        return self.skipWaiting();
      })
  );
});

// Aktivera Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache');
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activated');
      return self.clients.claim();
    })
  );
});

// Intercepta nätverksförfrågningar
self.addEventListener('fetch', event => {
  // Endast cache GET-förfrågningar
  if (event.request.method !== 'GET') {
    return;
  }

  // Skippa Firebase-förfrågningar (de hanteras av Firebase SDK)
  if (event.request.url.includes('firebase') || 
      event.request.url.includes('googleapis') ||
      event.request.url.includes('gstatic')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Returnera cachad version om den finns
        if (response) {
          return response;
        }

        // Annars hämta från nätverk
        return fetch(event.request).then(response => {
          // Kontrollera om vi fick ett giltigt svar
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Klona svaret
          const responseToCache = response.clone();

          // Lägg till i cache
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch(() => {
          // Om nätverket inte fungerar, visa offline-sida
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
      })
  );
});

// Hantera push-notifikationer (för framtida funktionalitet)
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Ny aktivitet i VolleyCoach!',
    icon: '/scheme.png',
    badge: '/scheme.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Öppna app',
        icon: '/scheme.png'
      },
      {
        action: 'close',
        title: 'Stäng',
        icon: '/scheme.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('VolleyCoach', options)
  );
});

// Hantera notifikationsklick
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});