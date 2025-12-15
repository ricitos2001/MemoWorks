import {ChangeDetectorRef, Component, EventEmitter, Output} from '@angular/core';
import {ButtonComponent} from '../button/button.component';
import {FormInputComponent} from '../form-input/form-input.component';
import {FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { TaskService } from '../../../services/task.service';
import {CommunicationService} from '../../../services/shared/communication.service';
import {NgForOf, NgIf} from '@angular/common';
import { FormComponent, hasPendingChanges } from '../../../guards/pending-chances-guard';

@Component({
  selector: 'app-task-form',
  imports: [
    ButtonComponent,
    FormsModule,
    ReactiveFormsModule,
    FormInputComponent,
    NgIf,
    NgForOf,
  ],
  templateUrl: './task-form.component.html',
  styleUrl: '../../../../styles/styles.css',
})

export class TaskFormComponent {
  taskForm: FormGroup;

  constructor(
    private taskService: TaskService,
    private comm: CommunicationService,
    private fb: FormBuilder,
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.max(500)]],
      date: ['', [Validators.required, Validators.maxLength(50)]],
      time: ['', [Validators.required, Validators.maxLength(50)]],
      assigmentFor: { id: `${localStorage.getItem('userId')}` },
      status: true,
      labels: this.fb.array([]),
    });
  }

  get form() {
    return this.taskForm;
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

    const payload = {
      ...this.taskForm.value,
      labels: this.labels.value,
    };

    this.taskService.createTask(payload).subscribe({
      next: () => {
        this.comm.sendNotification({
          source: 'taskForm',
          type: 'success',
          message: 'Tarea creada correctamente',
        });

        this.create.emit();
      },
      error: () => {
        this.comm.sendNotification({
          source: 'taskForm',
          type: 'error',
          message: 'Error al crear la tarea',
        });
      }
    });
  }

  cancelTask() {
    if (hasPendingChanges(this)) {
      this.cancel.emit();
    }
  }
}
