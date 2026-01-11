import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import {AsyncPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import {ViewTaskButtonComponent} from '../view-task-button/view-task-button.component';
import { Router } from '@angular/router';
import {CommunicationService} from '../../../services/shared/communication.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ButtonComponent} from '../button/button.component';
import {TasksSignalStore} from '../../../stores/tasks.signal.store';
import {computed} from '@angular/core';

@Component({
  selector: 'app-tasks',
  imports: [
    NgForOf,
    DatePipe,
    ViewTaskButtonComponent,
    ButtonComponent,
    NgIf,
  ],
  templateUrl: './tasks.component.html',
  styleUrl:'../../../../styles/styles.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksComponent implements OnInit {
  @Output() createFromEmpty = new EventEmitter<void>();
  private tasksSignalStore = inject(TasksSignalStore);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private comm = inject(CommunicationService);

  email = localStorage.getItem('email');

  tasks = computed(() => this.tasksSignalStore.state().data);
  loading = computed(() => this.tasksSignalStore.state().loading);
  error = computed(() => this.tasksSignalStore.error());
  total = computed(() => this.tasksSignalStore.state().total);
  page = this.tasksSignalStore.page;
  pageSize = this.tasksSignalStore.pageSize;

  ngOnInit(): void {
    if (this.email) {
      this.tasksSignalStore.load(this.page());
    }

    this.comm.notifications$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(n => {
        if (n?.payload?.refreshTasks) {
          this.tasksSignalStore.load(this.page());
        }
      });
  }

  trackById(index: number, task: any) {
    return task.id;
  }

  viewDetails(taskId: string) {
    this.router.navigate(['/task', taskId], { state: { fromCalendar: false } });
  }

  formatTime(timeStr: string): Date | null {
    if (!timeStr) return null;
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(+hours, +minutes, 0, 0);
    return date;
  }

  nextPage() {
    if (this.page() < this.total()) {
      this.tasksSignalStore.load(this.page() + 1);
    }
  }

  prevPage() {
    if (this.page() > 0) {
      this.tasksSignalStore.load(this.page() - 1);
    }
  }
}
