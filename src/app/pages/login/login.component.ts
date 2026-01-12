import { Component, EventEmitter, Output, Optional, Host } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router, RouterLink} from '@angular/router';
import {ButtonComponent} from '../../components/shared/button/button.component';
import {FormInputComponent} from '../../components/shared/form-input/form-input.component';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {passwordStrength} from '../../validators/password-strength.validator';
import { AuthModalComponent } from '../../components/shared/auth-modal/auth-modal.component';
import {NotificationsService, Notification as AppNotification} from '../../services/notifications.service';

@Component({
  selector: 'app-login',
  imports: [
    ButtonComponent,
    FormInputComponent,
    ReactiveFormsModule,
    NgIf,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrl: '../../../styles/styles.css',
})
export class LoginComponent {
  @Output() authSuccess = new EventEmitter<void>();
  submitted = false;

  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private notifications: NotificationsService,
    @Optional() @Host() private authModal?: AuthModalComponent,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordStrength()]],
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();
    console.log('Formulario enviado sin recarga');
    console.log('Estado del formulario:', {
      valid: this.loginForm.valid,
      errors: this.loginForm.errors,
      emailErrors: this.loginForm.get('email')?.errors,
      passwordErrors: this.loginForm.get('password')?.errors
    });
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.submitted = true;
    this.authService.login(this.loginForm).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.authService.getUserIdFromToken();
        this.authService.saveToken(res.token);
        this.authService.loggedInSubject.next(true);
        this.authSuccess.emit();

        // Enviar notificación a la API
        const apiNotification: AppNotification = {
          title: 'Inicio de sesión',
          message: `El usuario ${this.loginForm.value.email} ha iniciado sesión.`,
          createdAt: new Date(),
        };
        this.notifications.pushNotifications(apiNotification).subscribe({
          next: () => {},
          error: (err) => { console.warn('Error enviando notificación al API:', err); }
        });
      },
      error: (err) => {
        console.error('Error en login', err);
      }
    });
  }

  openRegister(event: Event) {
    event.preventDefault();
    if (this.authModal) {
      this.authModal.open('register');
    } else {
      this.router.navigate(['/register']);
    }
  }

  close(event: Event) {
    event.preventDefault();
    if (this.authModal) {
      this.authModal.close();
    } else {
      this.router.navigate(['/']);
    }
  }
}
