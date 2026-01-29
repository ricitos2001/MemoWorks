import {Component, computed, DestroyRef, inject, OnInit} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {ViewTaskButtonComponent} from '../../components/shared/view-task-button/view-task-button.component';
import {Router} from '@angular/router';
import {TasksSignalStore} from '../../stores/tasks.signal.store';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {CommunicationService} from '../../services/shared/communication.service';
import {BackButton} from '../../components/shared/back-button/back-button';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {ButtonComponent} from '../../components/shared/button/button.component';
import {SliderComponent} from '../../components/shared/slider/slider.component';

@Component({
  selector: 'app-select-task-for-edit',
  imports: [
    DatePipe,
    NgForOf,
    NgIf,
    ViewTaskButtonComponent,
    BackButton,
    TranslateModule,
    SliderComponent
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
  private translate = inject(TranslateService);
  email = localStorage.getItem('email');
  tasks = computed(() => this.tasksSignalStore.state().data);
  loading = computed(() => this.tasksSignalStore.state().loading);
  error = computed(() => this.tasksSignalStore.error());
  total = computed(() => this.tasksSignalStore.state().total);
  page = this.tasksSignalStore.page;
  pageSize = this.tasksSignalStore.pageSize;
  loadingText = ''

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
    this.setTranslations();
    this.translate.onLangChange.subscribe(() => this.setTranslations());
  }

  trackById(index: number, task: any) {
    return task.id;
  }

  editTask(taskId: string) {
    this.router.navigate(['/selectTask', taskId]);
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
