import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LoadingService} from './shared/loading.service';
import {Observable} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {Task} from './task.service';
import {environment} from '../../enviroments/enviroment';
import {User} from './user.service';

export interface Group {
  id: string;
  name: string;
  description: string;
  adminUser: User;
  users: User[];
}

@Injectable({
  providedIn: 'root',
})

export class GroupService {
  token = localStorage.getItem('token');
  constructor(private http: HttpClient, private loadingService: LoadingService) { }

  getGroupByUserEmail(email: string | null): Observable<Task[]> {
    return this.http.get<Task[]>(`${environment.apiUrl}/api/v1/groups/myGroups/${email}`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

  getGroup(id: string): Observable<Task> {
    this.loadingService.show();
    return this.http.get<Task>(`${environment.apiUrl}/api/v1/groups/id/${id}`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    }).pipe(finalize(() => this.loadingService.hide()));
  }

  createGroup(group: any): Observable<Task> {
    return this.http.post<Task>(`${environment.apiUrl}/api/v1/groups`, group, {
      headers: { Authorization: `Bearer ${this.token}`}
    });
  }

  editGroup(id: string | null, group: any): Observable<Task> {
    return this.http.put<Task>(`${environment.apiUrl}/api/v1/groups/${id}`, group, {
      headers: { Authorization: `Bearer ${this.token}`}
    })
  }

  removeGroup(id: number): Observable<Task> {
    return this.http.delete<Task>(`${environment.apiUrl}/api/v1/tasks/${id}`, {
      headers: { Authorization: `Bearer ${this.token}`}
    })
  }
}
