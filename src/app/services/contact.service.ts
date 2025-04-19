import { Firestore, collection, doc, getDocs, query, where, setDoc } from '@angular/fire/firestore';
import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { updateDoc, deleteDoc } from 'firebase/firestore';


@Injectable({
  providedIn: 'root'
})
export class ContactService {
  firestore = inject(Firestore);
  authService = inject(AuthService);

  async addContactByPhone(phone: string): Promise<string> {
    
    const q = query(collection(this.firestore, 'users'), where('telefono', '==', phone));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      throw new Error('El contacto no existe');
    }

    const contactDoc = snapshot.docs[0];
    const contactData = contactDoc.data();
    const contactId = contactDoc.id;

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) throw new Error('Usuario no autenticado');

  
    const contactRef = doc(this.firestore, `users/${currentUser.uid}/contacts/${contactId}`);
    await setDoc(contactRef, contactData); 

    return contactId;
  }
  async updateContact(contactId: string, data: any): Promise<void> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) throw new Error('Usuario no autenticado');
  
    const contactRef = doc(this.firestore, `users/${currentUser.uid}/contacts/${contactId}`);
    await updateDoc(contactRef, data);
  }
  
  async deleteContact(contactId: string): Promise<void> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) throw new Error('Usuario no autenticado');
  
    const contactRef = doc(this.firestore, `users/${currentUser.uid}/contacts/${contactId}`);
    await deleteDoc(contactRef);
  }
}
