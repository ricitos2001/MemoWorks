import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {DatePipe, NgForOf} from '@angular/common';
import {ViewTaskButtonComponent} from '../../components/shared/view-task-button/view-task-button.component';
import {Task, TaskService} from '../../services/task.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-select-task-for-edit',
  imports: [
    DatePipe,
    NgForOf,
    ViewTaskButtonComponent
  ],
  templateUrl: './select-task-for-edit.component.html',
  styleUrl: '../../../styles/styles.css',
})
export class SelectTaskForEditComponent implements OnInit {
  tasks: Task[] = [];

  constructor(private taskService: TaskService, private cdr: ChangeDetectorRef, private router: Router) {}

  email = localStorage.getItem('email');
  ngOnInit(): void {
    this.loadTasks();
    this.taskService.getTasksByUserEmail(this.email).subscribe({
      next: (response: any) => {
        this.tasks = response.content;
        this.cdr.detectChanges();
      },
    });
  }

  loadTasks() {
    this.taskService.getTasksByUserEmail(this.email).subscribe({
      next: (response: any) => {
        this.tasks = response.content;
        this.cdr.detectChanges();
      },
    });
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
