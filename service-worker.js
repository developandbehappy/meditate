const CACHE_NAME = 'media-loader-cache-v6';
const urlsToCache = [
    './index.html',
    './manifest.json',
    './icons/192.png',
    './icons/512.png',
    "./audio/deputat_monk.mp3",
    "./audio/dyh_20sek.m4a",
    "./audio/end.m4a",
    "./audio/estas.m4a",
    "./audio/gita.m4a",
    "./audio/hoff_1min.mp3",
    "./audio/hoff_full.mp3",
    "./audio/imram.m4a",
    "./audio/kvadrat7.m4a",
    "./audio/samadhi.mp3",
    "./audio/samadhi2.mp3",
    "./audio/samadhi3.mp3",
    "./audio/xxx-2.mp3",
    "./audio/xxx.mp3",
    "./audio/zvon.mp3"
];

// Установка Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Кэширование ресурсов');
                return cache.addAll(urlsToCache);
            })
    );
});

// Активация
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cacheName => {
                    return cacheName !== CACHE_NAME;
                }).map(cacheName => {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

// Стратегия Cache First, Network Fallback
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request).then(
                    response => {
                        // Проверяем валидность ответа
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Клонируем ответ, так как он может быть использован только один раз
                        let responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});