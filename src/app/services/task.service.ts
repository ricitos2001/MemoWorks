import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';

export interface Task {
  id: number;
  title: string;
  description: string;
  date: string;
  assigmentFor: {
    id: number;
    name: string;
    username: string;
  };
  status: boolean;
  labels: string[];
}

@Injectable({
  providedIn: 'root',
})

export class TaskService {
  token = localStorage.getItem('token');

  constructor(private http: HttpClient) { }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>('http://localhost:8080/api/v1/tasks', {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

  getTask(id: string): Observable<Task> {
    return this.http.get<Task>(`http://localhost:8080/api/v1/tasks/id/${id}`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }
}
