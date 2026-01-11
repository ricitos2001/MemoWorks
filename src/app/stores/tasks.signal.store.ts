import { Injectable, signal } from '@angular/core';
import { TaskService, Task } from '../services/task.service';

@Injectable({ providedIn: 'root' })
export class TasksSignalStore {
  page = signal(0);
  pageSize = 20;

  state = signal<{
    loading: boolean;
    data: Task[];
    total: number;
  }>({
    loading: false,
    data: [],
    total: 0
  });

  error = signal<string | null>(null);
  email = localStorage.getItem('email');

  constructor(private api: TaskService) {}

  load(page: number) {
    if (!this.email) return;
    this.page.set(page);
    this.state.update(s => ({ ...s, loading: true }));
    this.error.set(null);

    this.api.getTasksByUserEmail(page, this.pageSize, this.email)
      .subscribe({
        next: res => {
          this.state.set({
            loading: false,
            data: res.content ?? [],
            total: res.totalElements ?? 0
          })
        },
        error: err => {
          console.error(err);
          this.state.update(s => ({ ...s, loading: false }));
          this.error.set('Error al cargar tareas');
        }
      });
  }

  loadAll() {
    if (!this.email) return;
    this.state.update(s => ({ ...s, loading: true }));
    this.error.set(null);

    let allTasks: Task[] = [];
    const pageSize = 50;
    const loadPage = (page: number) => {
      this.api.getTasksByUserEmail(page, pageSize, this.email).subscribe({
        next: res => {
          allTasks.push(...res.content);
          if (res.totalElements > allTasks.length) {
            loadPage(page + 1);
          } else {
            this.state.set({ loading: false, data: allTasks, total: allTasks.length });
          }
        },
        error: err => {
          console.error(err);
          this.state.update(s => ({ ...s, loading: false }));
          this.error.set('Error al cargar todas las tareas');
        }
      });
    };

    loadPage(0);
  }

  add(task: Task) {
    this.state.update(s => ({
      ...s,
      data: [...s.data, task],
      total: s.total + 1
    }));
  }

  update(task: Task) {
    this.state.update(s => ({
      ...s,
      data: s.data.map(t => (t.id === task.id ? task : t))
    }));
  }

  remove(id: string) {
    this.state.update(s => ({
      ...s,
      data: s.data.filter(t => t.id !== id),
      total: s.total - 1
    }));
  }
}
