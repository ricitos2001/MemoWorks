import {Component, EventEmitter, Output} from '@angular/core';
import {Button} from '../button/button';
import {FormInput} from '../form-input/form-input';
import {FormsModule, NgForm, ReactiveFormsModule} from '@angular/forms';
import { TaskService } from '../../../services/task.service';
import {NgIf} from '@angular/common';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import {CommunicationService} from '../../../services/shared/communication.service';




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

  constructor(private taskService: TaskService, private comm: CommunicationService) {}


  @Output() cancel = new EventEmitter<void>();
  @Output() create = new EventEmitter<void>();

  createTask(form: NgForm, event: Event) {
    event.preventDefault();
    console.log('Formulario enviado sin recarga');
    this.submitted = true;
    if (form.valid) {
      this.taskService.createTask(this.taskFormData).subscribe({
        next: (response) => {
          console.log('Enviado correctamente', response)
        },
        error: (err) => {
          console.error('Error al enviar', err)
        }
      });
      this.create.emit();
      this.onAction()
    }
  }

  cancelTask() {
    this.cancel.emit();
  }

  onAction() {
    this.comm.sendNotification({ source: 'hermano1', payload: { id: 123, msg: 'actualizado' } });
  }}
