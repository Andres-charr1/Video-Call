import { Component } from '@angular/core';
import { ContactService } from '../../services/contact.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.page.html',
  standalone: false
})
export class AddContactPage {
  telefono = '';

  constructor(
    private contactService: ContactService,
    private toastCtrl: ToastController
  ) {}

  async addContact() {
    try {
      await this.contactService.addContactByPhone(this.telefono);
      const toast = await this.toastCtrl.create({
        message: 'Contacto agregado correctamente',
        duration: 2000,
        color: 'success'
      });
      toast.present();
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: (error as Error).message || 'Error al agregar contacto',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    }
  }
}
