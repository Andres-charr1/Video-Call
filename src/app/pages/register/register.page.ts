import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage implements OnInit {

  user = { nombre: '', apellido: '', email: '', telefono: '', password: '' };

  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
   
  }
  goToLogin() {
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  register() {
    const { nombre, apellido, telefono, email, password } = this.user;
    this.authService.registerUser(email, password, { nombre, apellido, telefono }).subscribe(() => {
      
    });
    
  }
}

