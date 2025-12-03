import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Estado de login: true = logueado, false = no logueado
  private loggedInSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));

  // Observable público que se puede suscribir
  loggedIn$ = this.loggedInSubject.asObservable();

  login(token: string) {
    localStorage.setItem('token', token);
    this.loggedInSubject.next(true); // Notificamos cambio
  }

  logout() {
    localStorage.removeItem('token');
    this.loggedInSubject.next(false); // Notificamos cambio
  }

  // Método opcional para obtener estado actual
  isLoggedIn(): boolean {
    return this.loggedInSubject.value;
  }
}
