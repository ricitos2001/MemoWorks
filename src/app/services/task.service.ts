import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {SpinnerComponent} from '../components/shared/spinner/spinner.component';
import {LoadingService} from './shared/loading.service';
import {finalize} from 'rxjs/operators';

export interface Task {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  assigmentFor: {
    id: number;
  };
  status: boolean;
  labels: string[];
}

@Injectable({
  providedIn: 'root',
})

export class TaskService {
  token = localStorage.getItem('token');

  constructor(private http: HttpClient, private loadingService: LoadingService) { }

  getTasksByUserEmail(email: string | null): Observable<Task[]> {
    return this.http.get<Task[]>(`http://localhost:8080/api/v1/tasks/myTasks/${email}`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

  getTask(id: string): Observable<Task> {
    this.loadingService.show();
    return this.http.get<Task>(`http://localhost:8080/api/v1/tasks/id/${id}`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    }).pipe(finalize(() => this.loadingService.hide()));
  }

  createTask(task: any): Observable<Task> {
    return this.http.post<Task>(`http://localhost:8080/api/v1/tasks`, task, {
      headers: { Authorization: `Bearer ${this.token}`}
    });
  }

  editTask(id: string | null, task: any): Observable<Task> {
    return this.http.put<Task>(`http://localhost:8080/api/v1/tasks/${id}`, task, {
      headers: { Authorization: `Bearer ${this.token}`}
    })
  }

  removeTask(id: number): Observable<Task> {
    return this.http.delete<Task>(`http://localhost:8080/api/v1/tasks/${id}`, {
      headers: { Authorization: `Bearer ${this.token}`}
    })
  }
}
