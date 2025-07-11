// sw.js - Service Worker
const CACHE_NAME = 'gps-push-test-v1';
const urlsToCache = [
  '/',
  '/index.html'
];

// Service Worker kurulumu
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache açıldı');
        return cache.addAll(urlsToCache);
      })
  );
});

// Cache'den dosya getirme
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache'de varsa cache'den döndür
        if (response) {
          return response;
        }
        // Yoksa network'den getir
        return fetch(event.request);
      }
    )
  );
});

// Push notification dinleme
self.addEventListener('push', function(event) {
  console.log('Push mesajı alındı:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'Yeni bildirim!',
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23667eea"/><text x="50" y="60" text-anchor="middle" font-size="40" fill="white">📱</text></svg>',
    badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23667eea"/><text x="50" y="60" text-anchor="middle" font-size="40" fill="white">📱</text></svg>',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Uygulamayı Aç',
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🔍</text></svg>'
      },
      {
        action: 'close',
        title: 'Kapat',
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">❌</text></svg>'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('GPS Push Test', options)
  );
});

// Notification tıklama
self.addEventListener('notificationclick', function(event) {
  console.log('Notification tıklandı:', event);
  
  event.notification.close();

  if (event.action === 'explore') {
    // Uygulamayı aç
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Sadece kapat
    console.log('Notification kapatıldı');
  } else {
    // Default action - uygulamayı aç
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});