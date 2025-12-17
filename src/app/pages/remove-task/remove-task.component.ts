import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Task, TaskService} from '../../services/task.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DatePipe, NgForOf} from '@angular/common';
import {ViewTaskButtonComponent} from '../../components/shared/view-task-button/view-task-button.component';
import {CommunicationService} from '../../services/shared/communication.service';
import {FormBuilder} from '@angular/forms';
import {BackButton} from '../../components/shared/back-button/back-button';
import {TrashButtonComponent} from '../../components/shared/trash-button/trash-button.component';

@Component({
  selector: 'app-remove-task',
  imports: [
    DatePipe,
    NgForOf,
    ViewTaskButtonComponent,
    BackButton,
    TrashButtonComponent
  ],
  templateUrl: './remove-task.component.html',
  styleUrl: '../../../styles/styles.css',
})
export class RemoveTaskComponent implements OnInit {
  tasks: Task[] = [];

  constructor(private taskService: TaskService, private cdr: ChangeDetectorRef, private router: Router, private comm: CommunicationService) {}

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

  removeTask(taskId: number) {
    if (!taskId) return;
    this.taskService.removeTask(taskId).subscribe({
      next: () => {
        this.comm.sendNotification({
          source: 'taskForm',
          type: 'success',
          message: 'Tarea eliminada correctamente',
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


  formatTime(timeStr: string): Date | null {
    if (!timeStr) return null;
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(+hours, +minutes, 0, 0);
    return date;
  }
}
