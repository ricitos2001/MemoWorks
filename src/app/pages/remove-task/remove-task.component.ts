import {Component, computed, DestroyRef, inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {ViewTaskButtonComponent} from '../../components/shared/view-task-button/view-task-button.component';
import {CommunicationService} from '../../services/shared/communication.service';
import {BackButton} from '../../components/shared/back-button/back-button';
import {TrashButtonComponent} from '../../components/shared/trash-button/trash-button.component';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {TasksSignalStore} from '../../stores/tasks.signal.store';
import {TaskService} from '../../services/task.service';
import {NotificationsService, Notification} from '../../services/notifications.service';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {SliderComponent} from '../../components/shared/slider/slider.component';

@Component({
  selector: 'app-remove-task',
  imports: [
    DatePipe,
    NgForOf,
    ViewTaskButtonComponent,
    BackButton,
    TrashButtonComponent,
    NgIf,
    TranslateModule,
    SliderComponent
  ],
  templateUrl: './remove-task.component.html',
  styleUrl: '../../../styles/styles.css',
  standalone: true,
})

export class RemoveTaskComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private tasksSignalStore = inject(TasksSignalStore);
  private router = inject(Router);
  private comm = inject(CommunicationService);
  private taskService = inject(TaskService);
  private notifications = inject(NotificationsService);
  private translate = inject(TranslateService);
  email = localStorage.getItem('email');

  tasks = computed(() => this.tasksSignalStore.state().data);
  loading = computed(() => this.tasksSignalStore.state().loading);
  total = computed(() => this.tasksSignalStore.state().total);
  error = computed(() => this.tasksSignalStore.error());
  page = this.tasksSignalStore.page;
  pageSize = this.tasksSignalStore.pageSize;
  loadingText = ''

  ngOnInit(): void {
    this.comm.notifications$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(n => {
        if (n?.payload?.refreshTasks) {
          this.tasksSignalStore.load(this.page());
        }
      });

    if (this.email) {
      this.tasksSignalStore.load(this.page());
    }

    this.setTranslations();
    this.translate.onLangChange.subscribe(() => this.setTranslations());
  }

  removeTask(taskId: string) {
    if (!taskId) return;
    this.taskService.removeTask(taskId).subscribe({
      next: () => {
        this.tasksSignalStore.remove(taskId)
        this.comm.sendNotification({
          source: 'taskForm',
          type: 'success',
          message: 'Tarea eliminada correctamente',
        });
        const apiNotification: Notification = {
          title: 'Tarea eliminada',
          message: `La tarea con id ${taskId} ha sido eliminada.`,
          createdAt: new Date(),
          userEmail: this.email || '',
        };
        this.notifications.pushNotifications(apiNotification).subscribe({
          next: () => {},
          error: (err) => { console.warn('Error enviando notificación al API:', err); }
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

  private setTranslations() {
    this.loadingText = this.translate.instant('COMPONENTS.SHARED.TASKS.LOADINGTEXT');
  }
}
