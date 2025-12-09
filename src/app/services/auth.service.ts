import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = 'http://localhost:8080/api/v1/auth';

  loggedInSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
  loggedIn$ = this.loggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(data: { email: string; password: string }) {
    return this.http.post<any>(`${this.API_URL}/authenticate`, data);
  }

  register(data: { email: string; name: string; surnames: string; phoneNumber: string; username: string; password: string; rol: string }) {
    return this.http.post<any>(`${this.API_URL}/register`, data);
  }

  logout() {
    return this.http.post(`${this.API_URL}/logout`, {});
  }

  removeAccount() {
    return this.http.post(`${this.API_URL}/logout`, {});
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  removeToken() {
    localStorage.removeItem('token');
  }
}
