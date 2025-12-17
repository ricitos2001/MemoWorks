import {Component, DestroyRef, inject, OnInit, Output, EventEmitter} from '@angular/core';
import { TaskService, Task } from '../../../services/task.service';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import {ViewTaskButtonComponent} from '../view-task-button/view-task-button.component';
import { Router } from '@angular/router';
import {CommunicationService} from '../../../services/shared/communication.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ButtonComponent} from '../button/button.component';

@Component({
  selector: 'app-tasks',
  imports: [
    NgForOf,
    DatePipe,
    ViewTaskButtonComponent,
    ButtonComponent,
    NgIf
  ],
  templateUrl: './tasks.component.html',
  styleUrl: '../../../../styles/styles.css',
})
export class TasksComponent implements OnInit {
  @Output() createFromEmpty = new EventEmitter<void>();
  tasks: Task[] = [];

  constructor(private taskService: TaskService, private cdr: ChangeDetectorRef, private router: Router, private comm: CommunicationService) {}
  private destroyRef = inject(DestroyRef);

  id = localStorage.getItem('userId');

  ngOnInit(): void {
    this.loadTasks();
    this.comm.notifications$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(n => {
        if (n?.payload?.refreshTasks) {
          this.loadTasks();
        }
      });
  }

  private loadTasks(): void {
    if (!this.id) return;
    this.taskService.getTasksByUserId(this.id).subscribe({
      next: (response: any) => {
        this.tasks = response.content;
        this.cdr.detectChanges();
      },
    });
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
