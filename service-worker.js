const assetVersion = 1;
const assetCacheKey = 'assets-v' + assetVersion;

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(assetCacheKey).then(cache => {
            return cache.addAll([
                '/',
                '/css/app.css',
                '/dist/app.js',
                'http://localhost:4000/messages'
            ]);
        })
    )
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== assetCacheKey) {
                        return caches.delete(key);
                    }
                }),
            );
        }),
    );
});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(response => {
            if (response) {
                return response;
            }

            return fetch(e.request);
        })
    );
});

self.addEventListener('push', e => {
   e.waitUntil(
       self.registration.showNotification('Nouveau message', {
           icon: 'http://localhost:8000/images/icon.png',
       })
   );
});
