import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {Task} from './task.service';

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
}

@Injectable({
  providedIn: 'root',
})

export class UserService {
  token = localStorage.getItem('token');

  constructor(private http: HttpClient) { }

  getUserById(id: number): Observable<any> {
    return this.http.get(`http://localhost:8080/api/v1/users/id/${id}`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      });
  }
}
