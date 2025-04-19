import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PushNotifications } from '@capacitor/push-notifications';
import { Auth } from '@angular/fire/auth';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationAuthService {
  loginToExternalApi(email: string, password: string) {
    throw new Error('Method not implemented.');
  }

  constructor(
    private http: HttpClient,
    private auth: Auth
  ) {}

  async registerFCMTokenToBackend() {
    try {
      const permission = await PushNotifications.requestPermissions();
      if (permission.receive === 'granted') {

    
        await PushNotifications.register();

        
        let token: string | undefined;
        PushNotifications.addListener('registration', (tokenData) => {
          token = tokenData.value;
        });

        const user = this.auth.currentUser;

        if (user && token) {
          this.http.post('https://ravishing-courtesy-production.up.railway.app/user/login', {
            token,
            uid: user.uid
          }).subscribe({
            next: () => console.log('Token FCM enviado al backend'),
            error: (err) => console.error('Error al enviar token', err)
          });
          if (Capacitor.getPlatform() !== 'web') {
          
            PushNotifications.requestPermissions().then(result => {
              if (result.receive === 'granted') {
                PushNotifications.register();
              }
            });
          
            PushNotifications.addListener('registration', token => {
              console.log('Token: ', token.value);
            });
          
          }
        }
      }
    } catch (error) {
      console.error('Error en el proceso de notificación:', error);
    }
    
  }
  
}
