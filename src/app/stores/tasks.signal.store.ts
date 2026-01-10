import { Injectable, signal } from '@angular/core';
import { Task, TaskService } from '../services/task.service';

@Injectable({ providedIn: 'root' })
export class TasksSignalStore {
  private _tasks = signal<Task[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);

  tasks = this._tasks.asReadonly();
  loading = this._loading.asReadonly();
  error = this._error.asReadonly();

  constructor(private api: TaskService) {
    this.load(localStorage.getItem('email'));
  }

  load(email: string | null) {
    if (!email) return;
    this._loading.set(true);
    this._error.set(null);
    this.api.getTasksByUserEmail(email).subscribe({
      next: res => {
        this._tasks.set((res as any).content ?? []);
        this._loading.set(false);
      },
      error: err => {
        console.error(err);
        this._error.set('Error al cargar tareas');
        this._loading.set(false);
      }
    });
  }

  add(task: Task) {
    this._tasks.update(current => [...current, task]);
  }

  update(task: Task) {
    this._tasks.update(current =>
      current.map(t => (t.id === task.id ? task : t))
    );
  }

  remove(id: number) {
    this._tasks.update(current =>
      current.filter(t => t.id !== id)
    );
  }
}
