import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LoadingService} from './shared/loading.service';
import {finalize} from 'rxjs/operators';
import {environment} from '../../enviroments/enviroment';

export interface PaginatedResponse<T> {
  content: T[];
  pageable: any;
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  number: number;
  size: number;
  numberOfElements: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  assigmentFor: {
    id: number;
  };
  status: boolean;
  labels: string[];
  image: String;
}

@Injectable({
  providedIn: 'root',
})

export class TaskService {
  token = localStorage.getItem('token');

  constructor(private http: HttpClient, private loadingService: LoadingService) { }

  getTasksByUserEmail(page: number, pageSize: number, email: string | null): Observable<PaginatedResponse<Task>> {
    const params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);
    return this.http.get<PaginatedResponse<Task>>(
      `${environment.apiUrl}/api/v1/tasks/myTasks/${email}`,
      {
        headers: { Authorization: `Bearer ${this.token}` },
        params
      }
    );
  }

  getTask(id: string): Observable<Task> {
    this.loadingService.show();
    return this.http.get<Task>(`${environment.apiUrl}/api/v1/tasks/id/${id}`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    }).pipe(finalize(() => this.loadingService.hide()));
  }

  createTask(task: any): Observable<Task> {
    return this.http.post<Task>(`${environment.apiUrl}/api/v1/tasks`, task, {
      headers: { Authorization: `Bearer ${this.token}`}
    });
  }

  editTask(id: string | null, task: any): Observable<Task> {
    return this.http.put<Task>(`${environment.apiUrl}/api/v1/tasks/${id}`, task, {
      headers: { Authorization: `Bearer ${this.token}`}
    })
  }

  removeTask(id: string): Observable<Task> {
    return this.http.delete<Task>(`${environment.apiUrl}/api/v1/tasks/${id}`, {
      headers: { Authorization: `Bearer ${this.token}`}
    })
  }
}
