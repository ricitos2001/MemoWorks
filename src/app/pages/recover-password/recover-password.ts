import { Component } from '@angular/core';
import {Button} from '../../components/shared/button/button';
import {FormInput} from '../../components/shared/form-input/form-input';
import {FormsModule, NgForm, ReactiveFormsModule} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-recover-password',
  imports: [
    Button,
    FormInput,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './recover-password.html',
  styleUrl: '../../../styles/styles.css',
})
export class RecoverPassword {
  submitted = false;

  formData = {
    email: '',
    password: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  submitForm(form: NgForm, event: Event) {
    event.preventDefault();
    console.log('Formulario enviado sin recarga');
    this.submitted = true;

    if (form.valid) {
      this.authService.login(this.formData).subscribe({
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
  }
}
