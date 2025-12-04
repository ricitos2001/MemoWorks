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
  constructor(private authService: AuthService, private router: Router) {}
  submitted = false;

  submitForm(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      const token = 'token-ejemplo';
      if (token) {
        this.authService.register(token);
        this.router.navigate(['/dashboard']);
      }
    }
  }
}
