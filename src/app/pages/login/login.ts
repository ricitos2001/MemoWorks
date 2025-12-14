import { Component } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {Button} from '../../components/shared/button/button';
import {FormInput} from '../../components/shared/form-input/form-input';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {passwordStrength} from '../../validators/password-strength.validator';

@Component({
  selector: 'app-login',
  imports: [
    Button,
    FormInput,
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './login.html',
  styleUrl: '../../../styles/styles.css',
})

export class Login {
  submitted = false;

  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
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
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error en login', err);
      }
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);
    if (control?.errors?.['email']) return 'Email inválido';
    return '';
  }
}


