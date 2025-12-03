import { Component } from '@angular/core';
import {Button} from '../../components/shared/button/button';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-config',
  imports: [
    Button
  ],
  templateUrl: './config.html',
  styleUrl: '../../../styles/styles.css',
})
export class Config {
  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/landing']);
  }
}
