import {Component} from '@angular/core';
import {Button} from '../../components/shared/button/button';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user-settings',
  imports: [
    Button,
  ],
  templateUrl: './user-settings.html',
  styleUrl: '../../../styles/styles.css',
})

export class UserSettings{
  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.removeToken();
    this.authService.loggedInSubject.next(false);
    this.authService.logout();
    this.router.navigate(['/landing']);
  }

  removeAccount() {
    this.authService.removeToken();
    this.authService.loggedInSubject.next(false);
    this.authService.removeAccount();
    this.router.navigate(['/landing']);
  };
}
