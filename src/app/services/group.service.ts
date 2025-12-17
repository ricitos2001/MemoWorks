import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LoadingService} from './shared/loading.service';
import {Observable} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {Task} from './task.service';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  token = localStorage.getItem('token');
  constructor(private http: HttpClient, private loadingService: LoadingService) { }

  getGroupByUserId(id: string | null): Observable<Task[]> {
    return this.http.get<Task[]>(`http://localhost:8080/api/v1/tasks/myTasks/${id}`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

  getGroup(id: string): Observable<Task> {
    this.loadingService.show();
    return this.http.get<Task>(`http://localhost:8080/api/v1/tasks/id/${id}`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    }).pipe(finalize(() => this.loadingService.hide()));
  }

  createGroup(group: any): Observable<Task> {
    return this.http.post<Task>(`http://localhost:8080/api/v1/tasks`, group, {
      headers: { Authorization: `Bearer ${this.token}`}
    });
  }

  editGroup(id: string | null, group: any): Observable<Task> {
    return this.http.put<Task>(`http://localhost:8080/api/v1/tasks/${id}`, group, {
      headers: { Authorization: `Bearer ${this.token}`}
    })
  }

  removeGroup(id: number): Observable<Task> {
    return this.http.delete<Task>(`http://localhost:8080/api/v1/tasks/${id}`, {
      headers: { Authorization: `Bearer ${this.token}`}
    })
  }
}
