import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import {FormGroup} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn = !!localStorage.getItem('token');
  private API_URL = 'http://localhost:8080/api/v1/auth';

  loggedInSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
  loggedIn$ = this.loggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(data: FormGroup) {
    return this.http.post<any>(`${this.API_URL}/authenticate`, data.value);
  }

  register(data: FormGroup) {
    return this.http.post<any>(`${this.API_URL}/register`, data.value);
  }

  logout() {
    return this.http.post(`${this.API_URL}/logout`, {});
  }

  removeAccount() {
    return this.http.post(`${this.API_URL}/logout`, {});
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
    this.isLoggedIn = true;
    this.loggedInSubject.next(true);
  }

  getUserIdFromToken() {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = token.split('.')[1];
      const userData = JSON.parse(atob(payload));
      localStorage.setItem('userId', userData.id);
    }
  }

  removeUserData() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.isLoggedIn = false;
    this.loggedInSubject.next(false);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token') || this.isLoggedIn;
  }
}
