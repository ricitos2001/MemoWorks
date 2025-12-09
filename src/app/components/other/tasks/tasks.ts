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

  ngOnInit(): void {
    this.taskService.getTasks().subscribe({
      next: (response: any) => {
        this.tasks = response.content;
        this.cdr.detectChanges();
      },
    });
  }

  viewDetails(taskId: number) {
    this.router.navigate(['/dashboard', taskId]);
  }
}
