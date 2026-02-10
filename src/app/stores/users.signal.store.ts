import {Injectable, signal} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {User, UserService} from '../services/user.service';

interface UsersState {
  loading: boolean;
  data: User[];      // datos visibles (filtrados)
  allData: User[];   // fuente de verdad
  total: number;
}

@Injectable({providedIn: 'root'})
export class UsersSignalStore {

  page = signal(0);
  pageSize = 20;

  state = signal<UsersState>({
    loading: false,
    data: [],
    allData: [],
    total: 0
  });

  error = signal<string | null>(null);

  constructor(
    private api: UserService,
    private auth: AuthService
  ) {
    this.auth.loggedIn$.subscribe(loggedIn => {
      if (loggedIn) {
        this.load(0);
      } else {
        this.reset();
      }
    });
  }

  /* =======================
     Helpers
     ======================= */

  load(page: number) {
    this.page.set(page);
    this.state.update(s => ({...s, loading: true}));
    this.error.set(null);
    this.api.getPaginatedUsers(page, this.pageSize).subscribe({
      next: res => {
        const users = (res.content ?? []).map(u => this.normalizeUser(u));
        this.state.set({
          loading: false,
          data: users,
          allData: users,
          total: res.totalElements ?? 0
        });
      },
      error: err => {
        console.error(err);
        this.state.update(s => ({...s, loading: false}));
        this.error.set('Error al cargar tareas');
      }
    });
  }

  loadAll() {
    this.state.update(s => ({...s, loading: true}));
    this.error.set(null);
    let allUsers: User[] = [];
    const pageSize = 50;
    const loadPage = (page: number) => {
      this.api.getPaginatedUsers(page, pageSize)
        .subscribe({
          next: res => {
            const content = (res.content ?? []).map(u => this.normalizeUser(u));
            allUsers.push(...content);

            if (res.totalElements > allUsers.length) {
              loadPage(page + 1);
            } else {
              this.state.set({
                loading: false,
                data: allUsers,
                allData: allUsers,
                total: allUsers.length
              });
            }
          },
          error: err => {
            console.error(err);
            this.state.update(s => ({...s, loading: false}));
            this.error.set('Error al cargar todas las tareas');
          }
        });
    };
    loadPage(0);
  }

  search(term: unknown) {
    if (typeof term !== 'string') {
      this.state.update(s => ({...s, data: s.allData}));
      return;
    }
    const u = term.toLowerCase().trim();
    if (!u) {
      this.state.update(s => ({...s, data: s.allData}));
      return;
    }
    const filtered = this.state().allData.filter(user =>
      user.name.toLowerCase().includes(u)
    );
    this.state.update(s => ({
      ...s,
      data: filtered
    }));
  }

  private reset() {
    this.page.set(0);
    this.state.set({
      loading: false,
      data: [],
      allData: [],
      total: 0
    });
    this.error.set(null);
  }

  private normalizeUser(user: User): User {
    return {...user, id: user.id != null ? String(user.id) : user.id} as unknown as User;
  }
}


/*
@Injectable({ providedIn: 'root' })
export class ProductsStore {
  private _users = signal<User[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);

  users = this._users.asReadonly();
  loading = this._loading.asReadonly();
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
}*/
