import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ButtonComponent} from '../../components/shared/button/button.component';
import {AuthService} from '../../services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {User, UserService} from '../../services/user.service';
import {NgIf} from '@angular/common';
import {CommunicationService} from '../../services/shared/communication.service';

@Component({
  selector: 'app-user-settings',
  imports: [
    ButtonComponent,
    NgIf,
  ],
  templateUrl: './user-settings.component.html',
  styleUrl: '../../../styles/styles.css',
})

export class UserSettingsComponent implements OnInit{
  constructor(private authService: AuthService,
              private userService: UserService,
              private router: Router,
              private cd: ChangeDetectorRef,
              private route: ActivatedRoute,
              private comm: CommunicationService
              ) {}
  user?: User;

  email = localStorage.getItem('email');
  ngOnInit(): void {
    console.log(localStorage.getItem('token'));
    this.userService.getUser(this.email).subscribe({
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
    this.userService.getUser(this.email).subscribe({
      next: (data) => {
        this.user = data;
        const id = this.user.id;
        this.userService.removeUser(id).subscribe({
          next: () => {
            this.comm.sendNotification({
              source: 'userForm',
              type: 'success',
              message: 'Usuario eliminado correctamente',
            });
            this.authService.removeUserData();
            this.authService.loggedInSubject.next(false);
            this.router.navigate(['/landing']);
          },
          error: () => {
            this.comm.sendNotification({
              source: 'userForm',
              type: 'error',
              message: 'Error al eliminar el usuario',
            });
          }
        });
      },
      error: () => {
        console.error('No se pudo cargar el usuario');
      }
    });
  };

  editUserInfo() {
    this.router.navigate(['/editUserInfo', localStorage.getItem('userId')]);
  }
}
