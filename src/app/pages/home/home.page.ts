import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ContactService } from 'src/app/shared/services/contact.Service';
import { Contacto } from 'src/app/interfaces/contacto';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { copySync } from 'fs-extra';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  contactos: Contacto[] = [];
  uid: string = '';
  loading: boolean = false;
  error: string = '';

  constructor(
    private contactService: ContactService,
    private authService: AuthenticationService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
  ) {}

  async ngOnInit() {
    try {
      this.loading = true;
      this.uid = this.contactService.getCurrentUserId();
      console.log('UID del usuario actual:', this.uid);
      this.contactos = await this.contactService.getContacts(this.uid);
      console.log('Contactos cargados:', this.contactos);
    } catch (err) {
      this.error = 'Error cargando contactos';
      console.error(err);
    } finally {
      this.loading = false;
    }
  }

  async logout() {
    const loading = await this.loadingCtrl.create({
      message: 'Cerrando sesión...',
      spinner: 'crescent',
      duration: 1500,
    });

    await loading.present();

    try {
      await this.authService.logout();
      this.router.navigate(['/login'], {
        replaceUrl: true,
        state: { logoutSuccess: true },
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      this.showToast('Error al cerrar sesión', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color,
      position: 'top',
    });
    await toast.present();
  }

  async eliminarContacto(contactId: string) {
    try {
      await this.contactService.deleteContact(this.uid, contactId);
      this.contactos = await this.contactService.getContacts(this.uid);
      this.showToast('Contacto eliminado', 'success');
    } catch (err) {
      console.error('Error eliminando contacto', err);
      this.showToast('Error al eliminar contacto', 'danger');
    }
  }

  async goToChat(phoneNumber: string) {
    await this.router.navigate(['/chats', phoneNumber]);
  }

  async editContact(contactId: string) {
    await this.router.navigate(['../add.contact', contactId]);
  }
}
