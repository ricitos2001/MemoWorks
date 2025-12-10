import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Button} from '../../components/shared/button/button';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {User, UserService} from '../../services/user.service';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-user-settings',
  imports: [
    Button,
    NgIf,
  ],
  templateUrl: './user-settings.html',
  styleUrl: '../../../styles/styles.css',
})

export class UserSettings implements OnInit{
  constructor(private authService: AuthService, private userService: UserService, private router: Router, private cd: ChangeDetectorRef) {}
  user?: User;

  id = localStorage.getItem('userId');
  ngOnInit(): void {
    console.log(localStorage.getItem('token'));
    this.userService.getUserById(this.id).subscribe({
      next: (data) => {
        this.user = data;
        this.cd.detectChanges()
      },
      error: () => {
        console.error('No se pudo cargar el usuario');
      }
    });
  }

  logout() {
    this.authService.removeUserData();
    this.authService.loggedInSubject.next(false);
    this.authService.logout();
    this.router.navigate(['/landing']);
  }

  removeAccount() {
    this.authService.removeUserData();
    this.authService.loggedInSubject.next(false);
    this.authService.removeAccount();
    this.router.navigate(['/landing']);
  };
}
