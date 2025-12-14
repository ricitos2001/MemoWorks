import {ChangeDetectorRef, Component, EventEmitter, Output} from '@angular/core';
import {Button} from '../button/button';
import {FormInput} from '../form-input/form-input';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { TaskService } from '../../../services/task.service';
import {CommunicationService} from '../../../services/shared/communication.service';
import {NgForOf, NgIf} from '@angular/common';




@Component({
  selector: 'app-task-form',
  imports: [
    Button,
    FormsModule,
    ReactiveFormsModule,
    FormInput,
    NgIf,
    NgForOf,
  ],
  templateUrl: './task-form.html',
  styleUrl: '../../../../styles/styles.css',
})

export class TaskForm {

  submitted = false;
  taskForm: FormGroup


  constructor(private taskService: TaskService, private comm: CommunicationService, private fb: FormBuilder, private cd: ChangeDetectorRef) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.max(500)]],
      date: ['', [Validators.required, Validators.maxLength(50)]],
      time: ['', [Validators.required, Validators.maxLength(50)]],
      assigmentFor: {
        id: `${localStorage.getItem('userId')}`,},
      status: true,
      labels: this.fb.array([]),
    });
  }

  get labels(): FormArray {
    return this.taskForm.get('labels') as FormArray;
  }

  addLabel(value: string): void {
    const label = value.trim();
    if (!label) return;
    if (this.labels.value.includes(label)) return;
    this.labels.push(this.fb.control(label));
  }

  removeLabel(index: number): void {
    this.labels.removeAt(index);
  }

  get labelControls(): FormControl[] {
    return this.labels.controls as FormControl[];
  }

  @Output() cancel = new EventEmitter<void>();
  @Output() create = new EventEmitter<void>();

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }
    this.submitted = true;
    const payload = {
      ...this.taskForm.value,
      labels: this.labels.value,
    };

    this.taskService.createTask(payload).subscribe({
      next: (response) => {
        this.create.emit();
        this.onAction(response);
      },
      error: (err) => {
        console.error('Error al enviar', err);
      }
    });
  }

  cancelTask() {
    this.cancel.emit();
  }

  onAction(response: any) {
    this.comm.sendNotification({ source: 'taskForm', payload: response });
  }}
