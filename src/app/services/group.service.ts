import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LoadingService} from './shared/loading.service';
import {Observable} from 'rxjs';
import {finalize, map} from 'rxjs/operators';
import {PaginatedResponse, Task} from './task.service';
import {environment} from '../../enviroments/enviroment';
import {User} from './user.service';

export interface Group {
  id: string;
  name: string;
  description: string;
  adminUser: User;
  users: User[];
  image: string;
}

@Injectable({
  providedIn: 'root',
})

export class GroupService {
  token = localStorage.getItem('token');
  constructor(private http: HttpClient, private loadingService: LoadingService) { }

  getGroups(): Observable<Group[]> {
    return this.http.get<PaginatedResponse<Group>>(
      `${environment.apiUrl}/api/v1/groups`,
      {
        headers: { Authorization: `Bearer ${this.token}` }
      }
    ).pipe(
      map(page => page.content ?? [])
    );
  }

  getGroupsByUserEmail(email: string | null): Observable<Group[]> {
    return this.http.get<PaginatedResponse<Group>>(
      `${environment.apiUrl}/api/v1/groups/myGroups/${email}`,
      {
        headers: { Authorization: `Bearer ${this.token}` }
      }
    ).pipe(
      map(page => page.content ?? [])
    );
  }

  getGroup(id: string): Observable<Group> {
    this.loadingService.show();
    return this.http.get<Group>(`${environment.apiUrl}/api/v1/groups/id/${id}`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    }).pipe(finalize(() => this.loadingService.hide()));
  }

  createGroup(group: any): Observable<Group> {
    return this.http.post<Group>(`${environment.apiUrl}/api/v1/groups`, group, {
      headers: { Authorization: `Bearer ${this.token}`}
    });
  }

  editGroup(id: string | null, group: any): Observable<Group> {
    return this.http.put<Group>(`${environment.apiUrl}/api/v1/groups/${id}`, group, {
      headers: { Authorization: `Bearer ${this.token}` }
    })
  }

  removeGroup(id: number): Observable<Group> {
    return this.http.delete<Group>(`${environment.apiUrl}/api/v1/groups/${id}`, {
      headers: { Authorization: `Bearer ${this.token}` }
    })
  }

  getImage(groupId: string, cacheBust: boolean = false): Observable<Blob> {
    const url = cacheBust ? `${environment.apiUrl}/api/v1/groups/${groupId}/avatar?t=${Date.now()}` : `${environment.apiUrl}/api/v1/groups/${groupId}/avatar`;
    return this.http.get(url, {
      headers: { Authorization: `Bearer ${this.token}` },
      responseType: 'blob'
    });
  }

  postImage(groupId: string, imageFormData: FormData): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/v1/groups/${groupId}/avatar`, imageFormData, {
      headers: { Authorization: `Bearer ${this.token}` },
      responseType: 'text' as 'json'
    });
  }
}
