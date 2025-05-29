import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
} from '@angular/fire/firestore';
import { Contacto } from 'src/app/interfaces/contacto';
import { Usuario } from 'src/app/interfaces/usuario';
import { Auth } from '@angular/fire/auth';
import { addDoc, CollectionReference, DocumentData } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  constructor(
    private firestore: Firestore,
    private userService: UsuarioService,
    private auth: Auth,
  ) {}

  private contactsSubject = new BehaviorSubject<Contacto[]>([]);
  contacts$ = this.contactsSubject.asObservable();

  getCurrentUserId(): string {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Usuario no autenticado');
    return user.uid;
  }

  async findUserByPhoneNumber(phone: string): Promise<Usuario | null> {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('telefono', '==', phone));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const docSnap = snapshot.docs[0];
      const data = docSnap.data() as Omit<Usuario, 'uid'>;
      return { uid: docSnap.id, ...data };
    }

    return null;
  }

  async addContact(userId: string, contact: Contacto): Promise<void> {
    const contactRef = doc(
      this.firestore,
      `users/${userId}/contacts/${contact.uid}`,
    );
    await setDoc(contactRef, contact);
    console.log('Contacto guardado en Firestore:', contact);
  }

  async deleteContact(uid: string, contactId: string): Promise<void> {
    const docRef = doc(this.firestore, `users/${uid}/contacts/${contactId}`);
    await deleteDoc(docRef);
  }

  private getContactsCollectionRef(
    uid: string,
  ): CollectionReference<DocumentData> {
    return collection(this.firestore, `users/${uid}/contacts`);
  }

  async guardar(uid: string, phone: string) {
    const user = await this.userService.buscarPorTelefono(phone);
    if (user === null) {
      console.error(
        'Usuario no encontrado con el teléfono proporcionado:',
        phone,
      );
      return;
    }
    const contact = { user_uid: user?.uid };
    const colRef = this.getContactsCollectionRef(uid);
    await addDoc(colRef, contact);
  }

   async getContacts(userId: string): Promise<Contacto[]> {
  const contactsRef = collection(this.firestore, `users/${userId}/contacts`);
  const snap = await getDocs(contactsRef);

  return snap.docs.map(doc => {
    const data = doc.data() as Contacto;
    return {
      ...data,
      uid: doc.id
    };
  });
}
}
