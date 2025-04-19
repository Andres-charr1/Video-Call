import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NotificationAuthService } from 'src/app/services/notification-auth.service'; // asegurate del path correcto


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router, private notificationService: NotificationAuthService) {}
  ngOnInit(): void {
  
  }
  goToRegister() {
    this.router.navigateByUrl('/register', { replaceUrl: true })
  }

  login() {
    this.authService.loginUser(this.email, this.password).subscribe({
      next: () => {
    
        this.notificationService.registerFCMTokenToBackend();
  
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Error al iniciar sesión', err);
      
      }
    });
    
  }
  
  signInGoogle() {
    this.authService.signInWithGoogle().then(() => {
   
      this.notificationService.registerFCMTokenToBackend();
  
      this.router.navigate(['/home']);
    }).catch(err => {
      console.error('Error con Google Sign-In', err);
    });
  }
  
  }
  

