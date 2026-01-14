import {
  Component, DestroyRef, EventEmitter, inject, OnInit, Output, ChangeDetectionStrategy, computed} from '@angular/core';
import { NgForOf, NgIf, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TasksSignalStore } from '../../../stores/tasks.signal.store';
import { CommunicationService } from '../../../services/shared/communication.service';

import { ViewTaskButtonComponent } from '../view-task-button/view-task-button.component';
import { ButtonComponent } from '../button/button.component';
import { SharedBarComponent } from '../shared-bar/shared-bar.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    DatePipe,
    ViewTaskButtonComponent,
    ButtonComponent,
    SharedBarComponent
  ],
  templateUrl: './tasks.component.html',
  styleUrl: '../../../../styles/styles.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksComponent implements OnInit {

  @Output() createFromEmpty = new EventEmitter<void>();

  private store = inject(TasksSignalStore);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private comm = inject(CommunicationService);

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

  email = localStorage.getItem('email');

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

  nextPage() {
    if (this.page() < this.total()) {
      this.store.load(this.page() + 1);
    }
  }

  prevPage() {
    if (this.page() > 0) {
      this.store.load(this.page() - 1);
    }
  }
}
