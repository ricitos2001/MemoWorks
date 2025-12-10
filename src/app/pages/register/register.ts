import { Component } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {Button} from '../../components/shared/button/button';
import {FormInput} from '../../components/shared/form-input/form-input';
import {FormsModule, NgForm} from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [
    Button,
    FormInput,
    FormsModule
  ],
  templateUrl: './register.html',
  styleUrl: '../../../styles/styles.css',
})
export class Register {
  submitted = false;

  formData = {
    email: '',
    name: '',
    surnames: '',
    phoneNumber: '',
    username: '',
    password: '',
    repeatPassword: '',
    rol: 'USUARIO'
  };

  constructor(private authService: AuthService, private router: Router) {}

  submitForm(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      if (this.formData.password !== this.formData.repeatPassword) {
        console.error('Las contraseñas no coinciden');
        return;
      } else {
        this.authService.register(this.formData).subscribe({
          next: (res) => {
            localStorage.setItem('token', res.token);
            this.authService.getUserIdFromToken();
            this.authService.saveToken(res.token);
            this.authService.loggedInSubject.next(true);
            this.router.navigate(['/dashboard']);
          },
          error: (err) => {
            console.error('Error en registo', err);
          }
        });
      }
    }
  }
}
