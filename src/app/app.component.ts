import { Component } from '@angular/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { AuthService } from './services/auth.service';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import {
  ActionPerformed,
  PushNotificationSchema,

  Token,
} from '@capacitor/push-notifications';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: false,
})
export class AppComponent {
  constructor(
    private authService: AuthService,
    private firestore: Firestore
  ) {
    this.initPush();
  }

  async initPush() {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive !== 'granted') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive === 'granted') {
      PushNotifications.register();

      PushNotifications.addListener('registration', async (token) => {
        const user = this.authService.getCurrentUser();
        if (user) {
          const userRef = doc(this.firestore, `users/${user.uid}`);
          await updateDoc(userRef, { token: token.value });
        }
      });

      PushNotifications.addListener('registrationError', (err) => {
        console.error('Registration error: ', err);
      });

      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push received: ', notification);
      });

      PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
        console.log('Action performed: ', action);
      });
    }
  }
}
