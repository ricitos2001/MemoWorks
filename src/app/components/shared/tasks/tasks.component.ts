import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';
import {AsyncPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import {ViewTaskButtonComponent} from '../view-task-button/view-task-button.component';
import { Router } from '@angular/router';
import {CommunicationService} from '../../../services/shared/communication.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ButtonComponent} from '../button/button.component';
import {TasksSignalStore} from '../../../stores/tasks.signal.store';

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
  styleUrl: '../../../../styles/styles.css',
})

export class TasksComponent implements OnInit {
  @Output() createFromEmpty = new EventEmitter<void>();
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

  viewDetails(taskId: number) {
    this.router.navigate(['/task', taskId], { state: { fromCalendar: false } });
  }

  formatTime(timeStr: string): Date | null {
    if (!timeStr) return null;
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(+hours, +minutes, 0, 0);
    return date;
  }
}
