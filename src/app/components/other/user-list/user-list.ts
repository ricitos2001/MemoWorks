import { Component, signal } from '@angular/core';
import {User, UserService} from '../../../services/user.service';
import {AsyncPipe, CommonModule, NgIf} from '@angular/common';

@Component({
  selector: 'app-user-list',
  imports: [
    NgIf,
    AsyncPipe,
    CommonModule
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList {
  users$;

  constructor(private userService: UserService) {
    this.users$ = this.userService.getUsers();
  }

  selectedUser = signal<User | null>(null);

  select(u: User) {
    this.selectedUser.set(u);
  }
}
