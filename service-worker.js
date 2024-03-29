self.addEventListener('install', e => {
    e.waitUntil(
        caches.open('assets').then(cache => {
            cache.addAll([
                '/',
                '/css/app.css',
                '/dist/app.js',
            ]);
        })
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
