import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ButtonComponent} from '../../components/shared/button/button.component';
import {FormInputComponent} from '../../components/shared/form-input/form-input.component';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {TaskService} from '../../services/task.service';
import {CommunicationService} from '../../services/shared/communication.service';
import {NgForOf, NgIf} from '@angular/common';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-add-task',
  imports: [
    ButtonComponent,
    FormsModule,
    ReactiveFormsModule,
    FormInputComponent,
    NgIf,
    NgForOf,
  ],
  templateUrl: './add-task.component.html',
  styleUrl: '../../../styles/styles.css',
})

export class AddTaskComponent implements OnInit {
  taskForm: FormGroup;
  loading = false;
  @Output() submitting = new EventEmitter<boolean>();

  constructor(
    private taskService: TaskService,
    private comm: CommunicationService,
    private fb: FormBuilder,
    private userService: UserService,
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.max(500)]],
      date: ['', [Validators.required, Validators.maxLength(50)]],
      time: ['', [Validators.required, Validators.maxLength(50)]],
      assigmentFor: { id: null },
      status: true,
      labels: this.fb.array([]),
    });
  }

  get labels(): FormArray {
    return this.taskForm.get('labels') as FormArray;
  }

  addLabel(value: string, event: Event): void {
    event.preventDefault();
    const label = value.trim();
    if (!label) return;
    if (this.labels.value.includes(label)) return;
    this.labels.push(this.fb.control(label));
  }

  removeLabel(index: number, event: Event): void {
    event.preventDefault()
    this.labels.removeAt(index);
  }

  @Output() cancel = new EventEmitter<void>();
  @Output() create = new EventEmitter<void>();

  ngOnInit(): void {
    const email = localStorage.getItem('email');
    if (!email) {
      return;
    }
    this.userService.getUser(email).subscribe({
      next: (user) => {
        if (!user || user.id === undefined || user.id === null) {
          return;
        }
        this.taskForm.patchValue({
          assigmentFor: {id: user.id}
        });
      },
      error: (err) => {
        console.error('ERROR GET USER:', err);
      }
    });
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    const assigmentFor = this.taskForm.value.assigmentFor;
    console.log(assigmentFor);
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.submitting.emit(true);

    const payload = {
      ...this.taskForm.value,
      labels: this.labels.value
    };

    this.taskService.createTask(payload).subscribe({
      next: () => {
        this.comm.sendNotification({
          source: 'taskForm',
          type: 'success',
          message: 'Tarea creada correctamente',
          payload: { refreshTasks: true }
        });
        this.create.emit();
      },
      error: () => {
        this.comm.sendNotification({
          source: 'taskForm',
          type: 'error',
          message: 'Error al crear la tarea',
        });
        this.loading = false;
        this.submitting.emit(false);
      },
      complete: () => {
        this.loading = false;
        this.submitting.emit(false);
      }
    });
  }
}
