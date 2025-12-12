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

  getUserById(id: string | null): Observable<any> {
    return this.http.get(`http://localhost:8080/api/v1/users/id/${id}`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      });
  }


  getUsers(): Observable<User[]> {
    return this.http.get<any>('http://localhost:8080/api/v1/users', {
      headers: { Authorization: `Bearer ${this.token}` }
    }).pipe(
      map(res => {
        if (Array.isArray(res)) return res;
        if (res.data && Array.isArray(res.data)) return res.data;
        return [];
      }),
      catchError(err => {
        this.toast.error('Error cargando usuarios');
        return throwError(() => err);
      })
    );
  }


  saveUser(user: User) {
    this.loading.show();
    return this.http.post<User>('http://localhost:8080/api/v1/users', user).pipe(finalize(() => this.loading.hide()));
  }
}
