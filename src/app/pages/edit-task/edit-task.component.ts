import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TaskService} from '../../services/task.service';
import {CommunicationService} from '../../services/shared/communication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {hasPendingChanges} from '../../guards/pending-chances-guard';
import {ButtonComponent} from '../../components/shared/button/button.component';
import {FormInputComponent} from '../../components/shared/form-input/form-input.component';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-edit-task',
  imports: [
    ButtonComponent,
    FormInputComponent,
    NgForOf,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './edit-task.component.html',
  styleUrl: '../../../styles/styles.css',
})
export class EditTaskComponent implements OnInit {
  taskForm: FormGroup;

  constructor(
    private taskService: TaskService,
    private comm: CommunicationService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
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

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getValues(id);
    }
  }

  getValues(id: string): void {
    this.taskService.getTask(id).subscribe({
      next: (task) => {
        if (!task) return;
        this.taskForm.patchValue({
          title: task.title,
          description: task.description,
          date: task.date,
          time: task.time,
          assigmentFor: task.assigmentFor,
          status: task.status,
        });
        this.labels.clear();
        if (Array.isArray(task.labels)) {
          task.labels.forEach((label: string) => {
            this.labels.push(this.fb.control(label));
          });
        }
        this.taskForm.markAsPristine();
      },
    });
  }

  addLabel(value: string, event: Event): void {
    event.preventDefault();
    const label = value.trim();
    if (!label) return;
    if (this.labels.value.includes(label)) return;
    this.labels.push(this.fb.control(label));
  }

  removeLabel(index: number, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.labels.removeAt(index);
  }

  @Output() cancel = new EventEmitter<void>();
  @Output() create = new EventEmitter<void>();

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }
    const id = this.route.snapshot.paramMap.get('id');
    const payload = {
      ...this.taskForm.value,
      labels: this.labels.value,
    };
    this.taskService.editTask(id, payload).subscribe({
      next: () => {
        this.comm.sendNotification({
          source: 'taskForm',
          type: 'success',
          message: 'Tarea actualizada correctamente',
        });
        this.create.emit();
        this.router.navigate(['/dashboard']);

      },
      error: () => {
        this.comm.sendNotification({
          source: 'taskForm',
          type: 'error',
          message: 'Error al editar la tarea',
        });
      }
    });
  }

  cancelTask(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    if (hasPendingChanges(this)) {
      this.cancel.emit();
      this.comm.sendNotification({
        source: 'taskForm',
        type: 'info',
        message: 'Tarea cancelada',
      });
      this.router.navigate(['/dashboard']);
    }
  }

  protected readonly event = event;
}
