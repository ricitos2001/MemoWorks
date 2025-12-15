import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, map, Observable, throwError} from 'rxjs';
import {Task} from './task.service';
import { LoadingService } from './shared/loading.service';
import { ToastService } from './shared/toast.service';
import {finalize} from 'rxjs/operators';


export interface User {
  id: number;
  name: string;
  surnames: string;
  username: string;
  phoneNumber: number;
  email: string;
  password: string;
  tasks: Task[];
  rol: string;
  active: boolean
}

@Injectable({
  providedIn: 'root',
})

export class UserService {
  token = localStorage.getItem('token');

  constructor(private http: HttpClient, private loading: LoadingService, private toast: ToastService) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`http://localhost:8080/api/v1/users`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

  getUser(id: string | null): Observable<User> {
    return this.http.get<User>(`http://localhost:8080/api/v1/users/id/${id}`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      });
  }

  editUser(id: string | null): Observable<User> {
    return this.http.put<User>(`http://localhost:8080/api/v1/users/${id}`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      });
  }

  removeUser(id: string | null): Observable<User> {
    return this.http.delete<User>(`http://localhost:8080/api/v1/users/${id}`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      });
  }
}
