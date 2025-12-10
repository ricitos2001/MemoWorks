import {Component, OnInit, ChangeDetectorRef, signal, inject} from '@angular/core';
import { TaskService, Task } from '../../../services/task.service';
import {DatePipe, NgIf} from '@angular/common';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-task-card',
  imports: [
    DatePipe,
    NgIf,
  ],
  templateUrl: './task-card.html',
  styleUrl: '../../../../styles/styles.css',
})
export class TaskCard implements OnInit {
  task?: Task;

  //taskId = signal<number | null>(null);

  constructor(private taskService: TaskService, private route: ActivatedRoute, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    /*
    const id = this.route.paramMap.subscribe(params => {
      this.taskId.set(Number(params.get('id')));
    });*/

    if (id) {
      this.taskService.getTask(id).subscribe({
        next: (data) => {
          this.task = data;
          this.cd.detectChanges();
        }
      });
    }
  }

  formatTime(timeStr: string): Date | null {
    if (!timeStr) return null;
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(+hours, +minutes, 0, 0);
    return date;
  }
}


