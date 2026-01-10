import {ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {ViewTaskButtonComponent} from '../../components/shared/view-task-button/view-task-button.component';
import {Task, TaskService} from '../../services/task.service';
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
    ViewTaskButtonComponent,
    NgIf,
    BackButton
  ],
  templateUrl: './select-task-for-edit.component.html',
  styleUrl: '../../../styles/styles.css',
})
export class SelectTaskForEditComponent implements OnInit {

  constructor(private router: Router, private comm: CommunicationService) {}
  private destroyRef = inject(DestroyRef);
  private tasksSignalStore = inject(TasksSignalStore);
  email = localStorage.getItem('email');
  tasks = this.tasksSignalStore.tasks;
  loading = this.tasksSignalStore.loading;
  error = this.tasksSignalStore.error

  ngOnInit(): void {
    this.comm.notifications$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(n => {
        if (n?.payload?.refreshTasks) {
          this.tasksSignalStore.load(this.email);
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
}
