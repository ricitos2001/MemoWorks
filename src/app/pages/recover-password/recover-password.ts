import { Component, EventEmitter, Output } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {Button} from '../../components/shared/button/button';
import {FormInput} from '../../components/shared/form-input/form-input';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {passwordStrength} from '../../validators/password-strength.validator';
import {passwordMatch} from '../../validators/password-match.validator';

@Component({
  selector: 'app-recover-password',
  imports: [
    Button,
    FormInput,
    ReactiveFormsModule
  ],
  templateUrl: './recover-password.html',
  styleUrl: '../../../styles/styles.css',
})

export class RecoverPassword {
  @Output() authSuccess = new EventEmitter<void>();

  submitted = false;

  recoverPasswordForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.recoverPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordStrength()]],
      newPassword: ['', [Validators.required, passwordStrength()]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatch('newPassword', 'confirmPassword') });
  }

  onSubmit(event: Event) {
    event.preventDefault();
    console.log('Formulario enviado sin recarga');
    if (this.recoverPasswordForm.invalid) {
      this.recoverPasswordForm.markAllAsTouched();
      return;
    }
    this.submitted = true;
    this.authService.login(this.recoverPasswordForm).subscribe({
      next: (res) => {
        console.log(res);
        localStorage.setItem('token', res.token);
        this.authService.getUserIdFromToken();
        this.authService.saveToken(res.token);
        this.authService.loggedInSubject.next(true);
        this.authSuccess.emit();
        // navegación delegada al componente padre
      },
      error: (err) => {
        console.error('Error en login', err);
      }
    });
  }
}

