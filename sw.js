// Service Worker för PWA-funktionalitet
const CACHE_NAME = 'volleycoach-v1.2.2';

// Använd relativa paths för att fungera både lokalt och i produktion
const urlsToCache = [
  './',
  './index.html',
  './offline.html',
  './manifest.json',
  './css/style.css',
  './js/main.js',
  './js/ui.js',
  './js/database.js',
  './js/firebase-config.js',
  './js/utils.js'
  // icon.png läggs till dynamiskt om den finns
];

// Installera Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching files');
        // Cacha filer individuellt för att undvika fel om någon saknas
        return Promise.allSettled(
          urlsToCache.map(url => 
            cache.add(url).catch(err => {
              console.warn(`Failed to cache ${url}:`, err);
              return Promise.resolve();
            })
          )
        );
      })
      .then(() => {
        console.log('Service Worker: Installed');
        return self.skipWaiting();
      })
      .catch(err => {
        console.error('Service Worker: Installation failed', err);
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

  // Skippa externa förfrågningar (Firebase, Google APIs, etc.)
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) {
    return;
  }

  // Skippa browser extensions och chrome-extension URLs
  if (event.request.url.includes('chrome-extension://') || 
      event.request.url.includes('extension://')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Returnera cachad version om den finns
        if (response) {
          console.log('Serving from cache:', event.request.url);
          return response;
        }

        // Annars hämta från nätverk
        return fetch(event.request)
          .then(response => {
            // Kontrollera om vi fick ett giltigt svar
            if (!response || response.status !== 200) {
              console.warn('Invalid response:', event.request.url, response?.status);
              return response;
            }

            // Endast cacha om det är en basic eller cors response
            if (response.type !== 'basic' && response.type !== 'cors') {
              return response;
            }

            // Klona svaret
            const responseToCache = response.clone();

            // Lägg till i cache asynkront
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              })
              .catch(err => {
                console.warn('Failed to cache:', event.request.url, err);
              });

            return response;
          })
          .catch(err => {
            console.error('Fetch failed:', event.request.url, err);
            // Om nätverket inte fungerar, visa offline-sida för dokument
            if (event.request.destination === 'document') {
              return caches.match('./offline.html')
                .then(offlinePage => {
                  if (offlinePage) {
                    return offlinePage;
                  }
                  // Om offline.html inte finns i cache, försök med index.html
                  return caches.match('./index.html')
                    .then(cachedIndex => {
                      if (cachedIndex) {
                        return cachedIndex;
                      }
                      // Sista fallback - enkel HTML
                      return new Response(
                        `<!DOCTYPE html>
                        <html lang="sv">
                        <head>
                          <meta charset="UTF-8">
                          <meta name="viewport" content="width=device-width, initial-scale=1.0">
                          <title>Offline - VolleyCoach</title>
                          <style>
                            body {
                              font-family: sans-serif;
                              display: flex;
                              align-items: center;
                              justify-content: center;
                              min-height: 100vh;
                              margin: 0;
                              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                              color: white;
                              text-align: center;
                              padding: 20px;
                            }
                            h1 { font-size: 2rem; margin-bottom: 1rem; }
                            p { font-size: 1.1rem; }
                            button {
                              margin-top: 20px;
                              padding: 12px 24px;
                              font-size: 1rem;
                              background: white;
                              color: #667eea;
                              border: none;
                              border-radius: 25px;
                              cursor: pointer;
                              font-weight: bold;
                            }
                          </style>
                        </head>
                        <body>
                          <div>
                            <h1>📡 Du är offline</h1>
                            <p>VolleyCoach kräver internetanslutning.</p>
                            <button onclick="window.location.reload()">Försök igen</button>
                          </div>
                        </body>
                        </html>`,
                        { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
                      );
                    });
                });
            }
            // För andra resurser, returnera ett tomt 503-svar
            return new Response('', { status: 503, statusText: 'Service Unavailable' });
          });
      })
  );
});

// Hantera push-notifikationer (för framtida funktionalitet)
self.addEventListener('push', event => {
  const title = 'VolleyCoach';
  const options = {
    body: event.data ? event.data.text() : 'Ny aktivitet i VolleyCoach!',
    icon: './icon-192.png',
    badge: './icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Öppna app'
      },
      {
        action: 'close',
        title: 'Stäng'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Hantera notifikationsklick
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('./')
    );
  } else if (event.action === 'close') {
    // Notifikationen stängs redan ovan
    return;
  } else {
    // Default action - öppna appen
    event.waitUntil(
      clients.openWindow('./')
    );
  }
});