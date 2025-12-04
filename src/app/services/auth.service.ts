import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Estado de login: true = logueado, false = no logueado
  private loggedInSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));

  loggedIn$ = this.loggedInSubject.asObservable();

  login(token: string) {
    localStorage.setItem('token', token);
    this.loggedInSubject.next(true);
  }

  register(token: string) {
    localStorage.setItem('token', token);
    this.loggedInSubject.next(true);
  }

  logout() {
    localStorage.removeItem('token');
    this.loggedInSubject.next(false);
  }

  isLoggedIn(): boolean {
    return this.loggedInSubject.value;
  }
}
