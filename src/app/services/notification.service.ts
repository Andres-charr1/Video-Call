import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() {}

  async requestAndRegisterFCM(): Promise<string | null> {
    if (Capacitor.getPlatform() === 'web') {
      console.warn('Push Notifications no están disponibles en web.');
      return null;
    }

    const permission = await PushNotifications.requestPermissions();
    if (permission.receive !== 'granted') {
      console.warn('Permiso de notificaciones denegado.');
      return null;
    }

    await PushNotifications.register();

    return new Promise((resolve, reject) => {
      PushNotifications.addListener('registration', (token) => {
        console.log('Token FCM:', token.value);
        resolve(token.value);
      });

      PushNotifications.addListener('registrationError', (err) => {
        console.error('Error en registro FCM:', err);
        reject(err);
      });
    });
  }
}
