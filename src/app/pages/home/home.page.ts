import { Component, OnInit } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ContactService } from '../../services/contact.service';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  standalone: false
})
export class HomePage implements OnInit {
  contacts: any[] = [];

  constructor(
    private firestore: Firestore,
    private authService: AuthService,
    private router: Router,
    private contactService: ContactService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  goToAddContact() {
    this.router.navigate(['/add-contact']);
  }

  ngOnInit() {
    this.authService.getAuthState().subscribe(user => {
      if (user) {
        const contactsRef = collection(this.firestore, `users/${user.uid}/contacts`);
        collectionData(contactsRef, { idField: 'id' }).subscribe(data => {
          this.contacts = data;
        });
      }
    });
  }

  async eliminarContacto(contactId: string) {
    try {
      await this.contactService.deleteContact(contactId);
      const toast = await this.toastCtrl.create({
        message: 'Contacto eliminado',
        duration: 2000,
        color: 'success'
      });
      toast.present();
    } catch (err) {
      console.error(err);
    }
  }

  async editarContacto(contacto: any) {
    const alert = await this.alertCtrl.create({
      header: 'Editar Contacto',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre',
          value: contacto.nombre
        },
        {
          name: 'email',
          type: 'email',
          placeholder: 'Email',
          value: contacto.email
        },
        {
          name: 'telefono',
          type: 'tel',
          placeholder: 'Teléfono',
          value: contacto.telefono
        }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: async data => {
            try {
              await this.contactService.updateContact(contacto.id, data);
              const toast = await this.toastCtrl.create({
                message: 'Contacto actualizado',
                duration: 2000,
                color: 'success'
              });
              toast.present();
            } catch (err) {
              console.error(err);
            }
          }
        }
      ]
    });

    await alert.present();
  }
}
