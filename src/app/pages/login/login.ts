import { Component } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {Button} from '../../components/shared/button/button';
import {FormInput} from '../../components/shared/form-input/form-input';
import {FormsModule, NgForm} from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [
    Button,
    FormInput,
    FormsModule
  ],
  templateUrl: './login.html',
  styleUrl: '../../../styles/styles.css',
})

export class Login {


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
          // Guardar el token real del backend
          console.log(res);
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


