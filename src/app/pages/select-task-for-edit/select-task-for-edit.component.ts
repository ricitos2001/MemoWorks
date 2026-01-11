import {Component, computed, DestroyRef, inject, OnInit} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {ViewTaskButtonComponent} from '../../components/shared/view-task-button/view-task-button.component';
import {Router} from '@angular/router';
import {TasksSignalStore} from '../../stores/tasks.signal.store';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {CommunicationService} from '../../services/shared/communication.service';
import {BackButton} from '../../components/shared/back-button/back-button';

@Component({
  selector: 'app-select-task-for-edit',
  imports: [
    DatePipe,
    NgForOf,
    NgIf,
    ViewTaskButtonComponent,
    BackButton
  ],
  templateUrl: './select-task-for-edit.component.html',
  styleUrl: '../../../styles/styles.css',
  standalone: true
})
export class SelectTaskForEditComponent implements OnInit {

  private destroyRef = inject(DestroyRef);
  private tasksSignalStore = inject(TasksSignalStore);
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

  editTask(taskId: number) {
    this.router.navigate(['/selectTask', taskId]);
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
