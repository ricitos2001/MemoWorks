import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  EventEmitter,
  inject,
  OnInit,
  Output
} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

import {TasksSignalStore} from '../../../stores/tasks.signal.store';
import {CommunicationService} from '../../../services/communication.service';

import {ViewTaskButtonComponent} from '../view-task-button/view-task-button.component';
import {ButtonComponent} from '../button/button.component';
import {SharedBarComponent} from '../shared-bar/shared-bar.component';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {SliderComponent} from '../slider/slider.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    DatePipe,
    ViewTaskButtonComponent,
    ButtonComponent,
    SharedBarComponent,
    TranslateModule,
    SliderComponent
  ],
  templateUrl: './tasks.component.html',
  styleUrl: '../../../../styles/styles.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksComponent implements OnInit {
  @Output() createFromEmpty = new EventEmitter<void>();
  loadingText = ''
  searcher: string = '';
  noResults: string = '';
  taskNotFound: string = '';
  startToOrganize: string = '';
  zeroTasks: string = '';
  createFirstTask: string = '';
  email = localStorage.getItem('email');
  private store = inject(TasksSignalStore);
  tasks = computed(() => this.store.state().data);
  loading = computed(() => this.store.state().loading);
  error = computed(() => this.store.error());
  total = computed(() => this.store.state().total);
  hasTasks = computed(() =>
    this.store.state().allData.length > 0
  );
  hasResults = computed(() =>
    this.store.state().data.length > 0
  );
  page = this.store.page;
  pageSize = this.store.pageSize;
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private comm = inject(CommunicationService);
  private translate = inject(TranslateService);

  ngOnInit(): void {
    if (this.email) {
      this.store.load(this.page());
    }

    this.comm.notifications$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(n => {
        if (n?.payload?.refreshTasks) {
          this.store.load(this.page());
        }
      });

    this.setTranslations();
    this.translate.onLangChange.subscribe(() => this.setTranslations());
  }

  onSearch(term: string) {
    this.store.search(term);
  }

  viewDetails(taskId: string) {
    this.router.navigate(['/task', taskId], {
      state: { fromCalendar: false }
    });
  }

  trackById(_: number, task: any) {
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
    this.searcher = this.translate.instant('COMPONENTS.SHARED.TASKS.SEARCHER');
    this.noResults = this.translate.instant('COMPONENTS.SHARED.TASKS.NORESULTS');
    this.taskNotFound = this.translate.instant('COMPONENTS.SHARED.TASKS.TASKNOTFOUND');
    this.startToOrganize = this.translate.instant('COMPONENTS.SHARED.TASKS.STARTTOORGANIZE');
    this.zeroTasks = this.translate.instant('COMPONENTS.SHARED.TASKS.ZEROTASKS');
    this.createFirstTask = this.translate.instant('COMPONENTS.SHARED.TASKS.CREATEFIRSTTASK');
  }
}
