const assetVersion = 1;
const assetCacheKey = 'assets-v' + assetVersion;

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(assetCacheKey).then(cache => {
            cache.addAll([
                '/',
                '/css/app.css',
                '/dist/app.js',
            ]);
        })
    );
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
