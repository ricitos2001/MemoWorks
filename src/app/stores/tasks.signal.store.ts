import {Injectable, signal} from '@angular/core';
import {Task, TaskService} from '../services/task.service';
import {AuthService} from '../services/auth.service';

interface TasksState {
  loading: boolean;
  data: Task[];      // datos visibles (filtrados)
  allData: Task[];   // fuente de verdad
  total: number;
}

@Injectable({providedIn: 'root'})
export class TasksSignalStore {

  page = signal(0);
  pageSize = 20;

  state = signal<TasksState>({
    loading: false,
    data: [],
    allData: [],
    total: 0
  });

  error = signal<string | null>(null);
  email: string | null = localStorage.getItem('email');

  constructor(
    private api: TaskService,
    private auth: AuthService
  ) {
    this.auth.loggedIn$.subscribe(loggedIn => {
      if (loggedIn) {
        this.email = localStorage.getItem('email');
        this.load(0);
      } else {
        this.email = null;
        this.reset();
      }
    });
  }

  /* =======================
     Helpers
     ======================= */

  load(page: number) {
    if (!this.email) return;
    this.page.set(page);
    this.state.update(s => ({...s, loading: true}));
    this.error.set(null);
    this.api.getTasksByUserEmail(page, this.pageSize, this.email)
      .subscribe({
        next: res => {
          const tasks = (res.content ?? []).map(t => this.normalizeTask(t));
          this.state.set({
            loading: false,
            data: tasks,
            allData: tasks,
            total: res.totalElements ?? 0
          });
        },
        error: err => {
          console.error(err);
          this.state.update(s => ({...s, loading: false}));
          this.error.set('Error al cargar tareas');
        }
      });
  }

  loadAll() {
    if (!this.email) return;
    this.state.update(s => ({...s, loading: true}));
    this.error.set(null);
    let allTasks: Task[] = [];
    const pageSize = 50;
    const loadPage = (page: number) => {
      this.api.getTasksByUserEmail(page, pageSize, this.email)
        .subscribe({
          next: res => {
            const content = (res.content ?? []).map(t => this.normalizeTask(t));
            allTasks.push(...content);

            if (res.totalElements > allTasks.length) {
              loadPage(page + 1);
            } else {
              this.state.set({
                loading: false,
                data: allTasks,
                allData: allTasks,
                total: allTasks.length
              });
            }
          },
          error: err => {
            console.error(err);
            this.state.update(s => ({...s, loading: false}));
            this.error.set('Error al cargar todas las tareas');
          }
        });
    };
    loadPage(0);
  }

  upsert(task: Task) {
    const t = this.normalizeTask(task);
    this.state.update(s => {
      const exists = s.allData.some(x => String(x.id) === String(t.id));
      const allData = exists
        ? s.allData.map(x => String(x.id) === String(t.id) ? t : x)
        : [...s.allData, t];

      return {
        ...s,
        allData,
        data: allData,
        total: exists ? s.total : s.total + 1
      };
    });
  }

  add(task: Task) {
    this.upsert(task);
  }

  update(task: Task) {
    this.upsert(task);
  }

  remove(id: string) {
    const normalizedId = String(id);
    this.state.update(s => {
      const allData = s.allData.filter(t => String(t.id) !== normalizedId);
      return {
        ...s,
        allData,
        data: allData,
        total: Math.max(0, s.total - 1)
      };
    });
  }

  search(term: unknown) {
    if (typeof term !== 'string') {
      this.state.update(s => ({...s, data: s.allData}));
      return;
    }
    const t = term.toLowerCase().trim();
    if (!t) {
      this.state.update(s => ({...s, data: s.allData}));
      return;
    }
    const filtered = this.state().allData.filter(task =>
      task.title.toLowerCase().includes(t) ||
      task.description.toLowerCase().includes(t) ||
      task.labels.some(lbl => lbl.toLowerCase().includes(t))
    );
    this.state.update(s => ({
      ...s,
      data: filtered
    }));
  }

  private reset() {
    this.page.set(0);
    this.state.set({
      loading: false,
      data: [],
      allData: [],
      total: 0
    });
    this.error.set(null);
  }

  private normalizeTask(task: Task): Task {
    return {
      ...task,
      id: task.id != null ? String(task.id) : task.id,
      labels: Array.isArray(task.labels)
        ? task.labels
        : task.labels
          ? [String(task.labels)]
          : []
    } as Task;
  }
}
