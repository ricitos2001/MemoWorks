import { Component, EventEmitter, Output, Optional, Host } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {ButtonComponent} from '../../components/shared/button/button.component';
import {FormInputComponent} from '../../components/shared/form-input/form-input.component';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {passwordStrength} from '../../validators/password-strength.validator';
import { AuthModalComponent } from '../../components/shared/modal/auth-modal.component';

@Component({
  selector: 'app-login',
  imports: [
    ButtonComponent,
    FormInputComponent,
    ReactiveFormsModule,
    NgIf,
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
    @Optional() @Host() private authModal?: AuthModalComponent
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
}
