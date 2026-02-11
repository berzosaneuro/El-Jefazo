
/**
 * TACTICAL NOTIFICATION ENGINE
 */

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.warn('Este navegador no soporta notificaciones de escritorio');
    return false;
  }

  if (Notification.permission === 'granted') return true;

  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

export const sendPushNotification = async (title: string, options: NotificationOptions = {}) => {
  const config = localStorage.getItem('ElJefazoConfig');
  if (config) {
    const parsed = JSON.parse(config);
    if (parsed.pushEnabled === false) return;
  }

  if (Notification.permission !== 'granted') return;

  // Intentar usar Service Worker para mejor soporte PWA
  const registration = await navigator.serviceWorker.getRegistration();
  
  // Fix: Cast defaultOptions to any to allow 'vibrate' property which might be missing in some NotificationOptions type definitions
  const defaultOptions: any = {
    icon: 'https://img.icons8.com/neon/96/cyberpunk-car.png', // Icono cyberpunk temporal
    badge: 'https://img.icons8.com/neon/96/cyberpunk-car.png',
    vibrate: [200, 100, 200],
    ...options
  };

  if (registration) {
    registration.showNotification(title, defaultOptions);
  } else {
    new Notification(title, defaultOptions);
  }
};
