import {Component, signal, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import { Task } from '../../../services/task.service';

@Component({
  selector: 'app-task-card',
  imports: [DatePipe, NgIf, NgForOf],
  templateUrl: './task-card.component.html',
  styleUrl: '../../../../styles/styles.css',
})
export class TaskCardComponent {

  private route = inject(ActivatedRoute);

  task = signal<Task | null>(null);

  constructor() {
    this.route.data.subscribe(({ task }) => {
      this.task.set(task);
    });
  }

  formatTime(timeStr: string): Date | null {
    if (!timeStr) return null;

    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(+hours, +minutes, 0, 0);
    return date;
  }
}
