import { Injectable, signal } from '@angular/core';
import { TaskService, Task } from '../services/task.service';
import { AuthService } from '../services/auth.service';

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
  email: string | null = localStorage.getItem('email');

  constructor(private api: TaskService, private auth: AuthService) {
    // React to login/logout so the tasks shown always match the current user
    this.auth.loggedIn$.subscribe(loggedIn => {
      if (loggedIn) {
        // Update email from localStorage (login flow should set it)
        this.email = localStorage.getItem('email');
        // Load first page for the new user
        this.load(0);
      } else {
        // Clear tasks when user logs out
        this.email = null;
        this.state.set({ loading: false, data: [], total: 0 });
      }
    });
  }

  private normalizeTask(task: Task): Task {
    // Ensure id is a string and labels is an array
    return {
      ...task,
      id: task.id != null ? String(task.id) : task.id,
      labels: Array.isArray(task.labels) ? task.labels : (task.labels ? [String(task.labels)] : [])
    } as Task;
  }

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

  upsert(task: Task) {
    const t = this.normalizeTask(task);
    console.debug('[TasksSignalStore] upsert task:', t);
    this.state.update(s => {
      const exists = s.data.some(x => String(x.id) === String(t.id));
      let data;
      if (exists) {
        data = s.data.map(x => (String(x.id) === String(t.id) ? t : x));
      } else {
        data = [...s.data, t];
      }
      return {
        ...s,
        data,
        total: exists ? s.total : s.total + 1
      };
    });
  }

  add(task: Task) {
    this.upsert(task);
  }

  update(task: Task) {
    const t = this.normalizeTask(task);
    this.state.update(s => ({
      ...s,
      data: s.data.map(t2 => (String(t2.id) === String(t.id) ? t : t2))
    }));
  }

  remove(id: string) {
    const normalizedId = String(id);
    this.state.update(s => ({
      ...s,
      data: s.data.filter(t => String(t.id) !== normalizedId),
      total: Math.max(0, s.total - 1)
    }));
  }

  search(term: unknown) {
    if (typeof term !== 'string') {
      this.load(this.page());
      return;
    }
    const t = term.toLowerCase().trim();
    if (!t) {
      this.load(this.page());
      return;
    }
    const filtered = this.state().data.filter(task =>
      task.title.toLowerCase().includes(t) ||
      task.description.toLowerCase().includes(t) ||
      task.labels.some(lbl => lbl.toLowerCase().includes(t))
    );
    this.state.update(s => ({
      ...s,
      data: filtered
    }));
  }
}
