import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { NavController } from '@ionic/angular';
import { AuthenticationService } from './authentication.service';
import { doc, updateDoc } from 'firebase/firestore';
import { LocalNotifications } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root'
})
export class PushNotiService {

  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private navCtrl: NavController,
  ) {}

   async registerPush() {
    if (Capacitor.getPlatform() === 'web') {
      console.warn('PushNotifications no está implementado en web.');
      return;
    }

    const permStatus = await PushNotifications.checkPermissions();
    if (permStatus.receive !== 'granted') {
      await PushNotifications.requestPermissions();
    }

    await PushNotifications.register();

    await PushNotifications.addListener('registration', async (token) => {
      console.log('📲 Token FCM recibido:', token.value);
      const user = this.auth.currentUser;

      const userRef = doc(this.firestore, `users/${user?.uid}`);
      await updateDoc(userRef, {token: token.value});
    });

    await PushNotifications.addListener('registrationError', (err) => {
      console.error('❌ Error de registro FCM:', err);
    });

    await PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('🔔 Notificación recibida:', JSON.stringify(notification));

      const meetingId = notification.data?.meetingId;
      const name = notification.data?.name;
      const user = this.auth.currentUser;
      console.log("user of fcm : " + JSON.stringify(user))

      if (meetingId && name) {
           this.navCtrl.navigateForward(['/llamada'], {
             state: {
               meetingId: meetingId,
               callerName: name
             }
           });
         }
    });

    await LocalNotifications.addListener('localNotificationActionPerformed', (event) => {
      console.log('➡️ Acción en notificación local:', event);

      const meetingId = event.notification?.extra?.meetingId;
      const callerName = event.notification?.extra?.callerName;

      if (meetingId && callerName) {
        console.log('📲 Volviendo a pantalla de llamada entrante');

        this.navCtrl.navigateForward(['/llamada'], {
          state: {
            meetingId: meetingId,
            callerName: callerName
          }
        });
      }
    });
  }
}
