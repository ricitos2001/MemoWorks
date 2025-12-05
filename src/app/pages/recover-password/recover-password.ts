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
