import {ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {TaskService} from '../../services/task.service';
import {Router} from '@angular/router';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {ViewTaskButtonComponent} from '../../components/shared/view-task-button/view-task-button.component';
import {CommunicationService} from '../../services/shared/communication.service';
import {BackButton} from '../../components/shared/back-button/back-button';
import {TrashButtonComponent} from '../../components/shared/trash-button/trash-button.component';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {TasksSignalStore} from '../../stores/tasks.signal.store';

@Component({
  selector: 'app-remove-task',
  imports: [
    DatePipe,
    NgForOf,
    ViewTaskButtonComponent,
    BackButton,
    TrashButtonComponent,
    NgIf
  ],
  templateUrl: './remove-task.component.html',
  styleUrl: '../../../styles/styles.css',
})
export class RemoveTaskComponent implements OnInit {
  constructor(private taskService: TaskService, private cdr: ChangeDetectorRef, private router: Router, private comm: CommunicationService) {}
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

  removeTask(taskId: number) {
    if (!taskId) return;
    this.taskService.removeTask(taskId).subscribe({
      next: () => {
        this.tasksSignalStore.remove(taskId)
        this.comm.sendNotification({
          source: 'taskForm',
          type: 'success',
          message: 'Tarea eliminada correctamente',
        });
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.comm.sendNotification({
          source: 'taskForm',
          type: 'error',
          message: err?.error?.message || 'Error al eliminar la tarea',
        });
      }
    });
  }

  trackById(index: number, task: any) {
    return task.id;
  }

  formatTime(timeStr: string): Date | null {
    if (!timeStr) return null;
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(+hours, +minutes, 0, 0);
    return date;
  }
}
