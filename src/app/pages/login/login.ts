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
  constructor(private authService: AuthService, private router: Router) {}
  submitted = false;
  submitForm(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      const token = 'token-ejemplo';
      if (token) {
        this.authService.login(token);
        this.router.navigate(['/dashboard']);
      }
    }
  }
}

