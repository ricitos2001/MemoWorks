import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthModalService {
  private openModalSource = new Subject<'login' | 'register'>();
  openModal$ = this.openModalSource.asObservable();

  open(tab: 'login' | 'register') {
    this.openModalSource.next(tab);
  }
}
