import { Component } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {Button} from '../../components/shared/button/button';
import {FormInput} from '../../components/shared/form-input/form-input';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {passwordMatch} from '../../validators/password-match.validator';
import {passwordStrength} from '../../validators/password-strength.validator';
import {phoneNumberValidation} from '../../validators/spanish-formats.validator';
import {AsyncValidatorsService} from '../../services/async-validators.service';

@Component({
  selector: 'app-register',
  imports: [
    Button,
    FormInput,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './register.html',
  styleUrl: '../../../styles/styles.css',
})
export class Register {
  submitted = false;
  registerForm: FormGroup;
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private asyncValidators: AsyncValidatorsService
  ) {
    this.registerForm = this.fb.group({
      email: ['', {
        validators: [Validators.required, Validators.email, Validators.maxLength(50)],
        asyncValidators: [this.asyncValidators.emailUnique()],
        updateOn: 'change'
      }],
      name: ['', [Validators.required, Validators.maxLength(50)]],
      surnames: ['', [Validators.required, Validators.maxLength(100)]],
      username: ['', {
        validators: [Validators.required, Validators.maxLength(50)],
        asyncValidators: [this.asyncValidators.usernameAvailable()],
        updateOn: 'change'
      }],
      phoneNumber: ['', [Validators.required, phoneNumberValidation()]],
      password: ['', [Validators.required, passwordStrength()]],
      repeatPassword: ['', Validators.required],
      rol: 'USUARIO'
    }, { validators: passwordMatch('password', 'repeatPassword') });
  }

  onSubmit(event: Event) {

    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.submitted = true;
      event.preventDefault();
      if (this.registerForm.invalid) {
        this.registerForm.markAllAsTouched();
        return;
      }
      this.authService.register(this.registerForm).subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          this.authService.getUserIdFromToken();
          this.authService.saveToken(res.token);
          this.authService.loggedInSubject.next(true);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Error en registro', err);
        }
      });
    }, 5000)
  }
}

