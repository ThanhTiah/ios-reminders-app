// Notification Manager for Web & PWA & Mobile Native
class NotificationEngine {
  constructor() {
    this.permission = Notification ? Notification.permission : 'default';
  }

  async requestPermission() {
    if (!('Notification' in window)) {
      console.warn('Browser does not support desktop notifications');
      return false;
    }
    try {
      const result = await Notification.requestPermission();
      this.permission = result;
      return result === 'granted';
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  sendNotification(title, options = {}) {
    if (this.permission !== 'granted') return;

    try {
      if ('serviceWorker' in navigator && navigator.serviceWorker.ready) {
        navigator.serviceWorker.ready.then(registration => {
          registration.showNotification(title, {
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            vibrate: [200, 100, 200],
            ...options
          });
        });
      } else {
        new Notification(title, {
          icon: '/icon-192.png',
          ...options
        });
      }
    } catch (e) {
      console.error('Error triggering notification:', e);
    }
  }
}

export const notificationEngine = new NotificationEngine();
