import {Component, EventEmitter, Output} from '@angular/core';
import {Button} from '../button/button';
import {FormInput} from '../form-input/form-input';
import {FormsModule, NgForm, ReactiveFormsModule} from '@angular/forms';
import { TaskService } from '../../../services/task.service';
import {NgIf} from '@angular/common';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';




@Component({
  selector: 'app-task-form',
  imports: [
    Button,
    FormsModule,
    ReactiveFormsModule,
    FormInput,
  ],
  templateUrl: './task-form.html',
  styleUrl: '../../../../styles/styles.css',
})

export class TaskForm {

  submitted = false;

  taskFormData = {
    title: '',
    description: '',
    date: '',
    time: '',
    assigmentFor: {
      id: `${localStorage.getItem('userId')}`,},
    status: true,
    labels: [] as string[],
  };

  constructor(private taskService: TaskService) {}


  @Output() cancel = new EventEmitter<void>();
  @Output() create = new EventEmitter<void>();

  createTask(form: NgForm) {
      this.submitted = true;
      if (form.valid) {
        this.taskService.createTask(this.taskFormData).subscribe({
          next: (response) => console.log('Enviado correctamente', response),
          error: (err) => console.error('Error al enviar', err)
        });
        this.create.emit();
      }
  }

  cancelTask() {
    this.cancel.emit();
  }
}
