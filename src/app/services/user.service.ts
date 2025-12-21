import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Task} from './task.service';
import { LoadingService } from './shared/loading.service';
import {finalize} from 'rxjs/operators';
import { environment } from '../../enviroments/enviroment';

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
  avatar: string;
  active: boolean
}

@Injectable({
  providedIn: 'root',
})

export class UserService {
  token = localStorage.getItem('token');

  constructor(private http: HttpClient, private loadingService: LoadingService) {
  }



  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/api/v1/users`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

  getUser(email: string | null): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/api/v1/users/email/${email}`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).pipe(finalize(() => this.loadingService.hide()));
  }

  editUser(id: string | null, user: User): Observable<User> {
    return this.http.put<User>(`${environment.apiUrl}/api/v1/users/${id}`, user,
      {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      });
  }

  removeUser(id: number): Observable<User> {
    return this.http.delete<User>(`${environment.apiUrl}/api/v1/users/${id}`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      });
  }

  // Devuelve la imagen como blob para poder usar URL.createObjectURL
  getImageProfile(id: number, cacheBust: boolean = false): Observable<Blob> {
    const url = cacheBust ? `${environment.apiUrl}/api/v1/users/${id}/avatar?t=${Date.now()}` : `${environment.apiUrl}/api/v1/users/${id}/avatar`;
    return this.http.get(url,
      {
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        responseType: 'blob'
      });
  }

  // Envía la imagen al servidor como FormData (multipart/form-data)
  postImageProfile(id: number, imageFormData: FormData): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/v1/users/${id}/avatar`, imageFormData,
      {
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        responseType: 'text' as 'json'
      });
  }
}
