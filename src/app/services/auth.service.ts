import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { signInWithCredential, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Capacitor } from '@capacitor/core';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: Auth, private firestore: Firestore) {}

  async signInWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    const platform = Capacitor.getPlatform();

    try {
      if (platform === 'web') {
      
        const result = await signInWithPopup(this.auth, provider);
        await this.saveUserData(result.user);
        console.log('Autenticado con Google (web):', result.user);
      } else {
       
        const googleUser = await GoogleAuth.signIn();
        const credential = GoogleAuthProvider.credential(googleUser.authentication.idToken);
        const result = await signInWithCredential(this.auth, credential);
        await this.saveUserData(result.user);
        console.log('Autenticado con Google (móvil):', result.user);
      }
    } catch (error) {
      console.error('Error al autenticar con Google:', error);
    }
  }

  private async saveUserData(user: User) {
    const userRef = doc(this.firestore, `users/${user.uid}`);
    await setDoc(userRef, {
      nombre: user.displayName,
      email: user.email,
      uid: user.uid,
      telefono: user.phoneNumber,
    }, { merge: true });
  }

  registerUser(email: string, password: string, userData: any) {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password).then(cred => {
        const uid = cred.user.uid;
        const userRef = doc(this.firestore, `users/${uid}`);
        return setDoc(userRef, userData);
      })
    );
  }

  loginUser(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logoutUser() {
    return from(signOut(this.auth));
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  getAuthState(): Observable<User | null> {
    return new Observable(observer => {
      this.auth.onAuthStateChanged(observer);
    });
  }
}
