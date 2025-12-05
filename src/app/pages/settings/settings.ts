import { Component } from '@angular/core';
import {Button} from '../../components/shared/button/button';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-settings',
  imports: [
    Button
  ],
  templateUrl: './settings.html',
  styleUrl: '../../../styles/styles.css',
})
export class Settings {
  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/landing']);
  }
}
