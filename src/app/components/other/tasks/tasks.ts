import { Component, OnInit} from '@angular/core';
import { TaskService, Task } from '../../../services/task.service';
import {DatePipe, NgForOf} from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import {ViewTaskButton} from '../view-task-button/view-task-button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tasks',
  imports: [
    NgForOf,
    DatePipe,
    ViewTaskButton,
  ],
  templateUrl: './tasks.html',
  styleUrl: '../../../../styles/styles.css',
})
export class Tasks implements OnInit {
  tasks: Task[] = [];


  constructor(private taskService: TaskService, private cdr: ChangeDetectorRef, private router: Router) {}


  id = localStorage.getItem('userId');
  ngOnInit(): void {
    this.taskService.getTasksByUserId(this.id).subscribe({
      next: (response: any) => {
        this.tasks = response.content;
        this.cdr.detectChanges();
      },
    });
  }

  viewDetails(taskId: number) {
    this.router.navigate(['/dashboard', taskId]);
  }

  formatTime(timeStr: string): Date | null {
    if (!timeStr) return null;
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(+hours, +minutes, 0, 0);
    return date;
  }
}
