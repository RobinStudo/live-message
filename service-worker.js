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
    e.waitUntil(activate());
});

self.addEventListener('fetch', e => {
    e.respondWith(fetch(e));
});

self.addEventListener('push', e => {
   e.waitUntil(
       self.registration.showNotification('Nouveau message', {
           icon: 'http://localhost:8000/images/icon.png',
       })
   );
});

const activate = async () => {
    caches.keys().then(keyList => {
        return Promise.all(
            keyList.map(key => {
                if (key !== assetCacheKey) {
                    return caches.delete(key);
                }
            }),
        );
    });

    if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable();
    }
}

const fetch = async (e) => {
    let response = await caches.match(e.request);
    if (response) {
        return response;
    }

    response = await e.preloadResponse;
    return response ?? fetch(e.request);
}
