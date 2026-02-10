import {User, UserService} from '../services/user.service';
import {Injectable, signal} from '@angular/core';

@Injectable({providedIn: 'root'})
export class ProductsStore {
  private _users = signal<User[]>([]);
  users = this._users.asReadonly();
  private _loading = signal(false);
  loading = this._loading.asReadonly();
  private _error = signal<string | null>(null);
  error = this._error.asReadonly();

  constructor(private api: UserService) {
    this.load();
  }

  load() {
    this._loading.set(true);
    this._error.set(null);

    this.api.getUsers().subscribe({
      next: list => {
        this._users.set(list);
        this._loading.set(false);
      },
      error: () => {
        this._error.set('Error al cargar productos');
        this._loading.set(false);
      }
    });
  }

  add(p: User) {
    this._users.update(list => [...list, p]);
  }
}
