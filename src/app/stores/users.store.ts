import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {User, UserService} from '../services/user.service';

@Injectable({ providedIn: 'root' })
export class UsersStore {
  private usersSubject = new BehaviorSubject<User[]>([]);
  users$ = this.usersSubject.asObservable();

  constructor(private api: UserService) {
    this.refresh();
  }

  refresh() {
    this.api.getUsers().subscribe(list => this.usersSubject.next(list));
  }

  add(user: User) {
    const current = this.usersSubject.value;
    this.usersSubject.next([...current, user]);
  }

  update(user: User) {
    const current = this.usersSubject.value;
    this.usersSubject.next(
      current.map(p => (p.id === user.id ? user : p))
    );
  }

  remove(id: number) {
    const current = this.usersSubject.value;
    this.usersSubject.next(current.filter(p => p.id !== id));
  }
}
