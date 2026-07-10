self.addEventListener('push', function(event) {
  if (event.data) {
    try {
      const data = event.data.json();
      const options = {
        body: data.body || '새로운 소식이 도착했습니다.',
        icon: '/assets/logo_transparent.png',
        badge: '/assets/logo_transparent.png',
        vibrate: [200, 100, 200],
        data: {
          url: '/'
        }
      };
      event.waitUntil(
        self.registration.showNotification(data.title || '마가공동체 아웃리치', options)
      );
    } catch (e) {
      console.error('Error displaying notification:', e);
    }
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
            break;
          }
        }
        return client.focus();
      }
      return clients.openWindow('/');
    })
  );
});
