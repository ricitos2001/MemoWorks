import {Component, EventEmitter, inject, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {map} from 'rxjs/operators';

import {ButtonComponent} from '../../components/shared/button/button.component';
import {FormInputComponent} from '../../components/shared/form-input/form-input.component';

import {TaskService} from '../../services/task.service';
import {CommunicationService} from '../../services/communication.service';
import {UserService} from '../../services/user.service';
import {TasksSignalStore} from '../../stores/tasks.signal.store';
import {Notification, NotificationsService} from '../../services/notifications.service';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {GroupsStore} from '../../stores/groups.store';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [
    ButtonComponent,
    FormsModule,
    ReactiveFormsModule,
    FormInputComponent,
    NgIf,
    NgForOf,
    AsyncPipe,
    TranslateModule,
  ],
  templateUrl: './add-task.component.html',
  styleUrl: '../../../styles/styles.css',
})
export class AddTaskComponent implements OnInit {

  groupsStore = inject(GroupsStore)
  @Output() submitting = new EventEmitter<boolean>();
  @Output() cancel = new EventEmitter<void>();
  @Output() create = new EventEmitter<void>();
  taskForm: FormGroup;
  loading = false;
  groupUsers: any[] = [];
  currentGroupId: string | null = null;
  email = localStorage.getItem('email');
  isAdmin$ = this.groupsStore.groups$.pipe(
    map(groups => {
      const group = groups[0];
      if (!group) return false;
      return group.adminUser?.email === localStorage.getItem('email');
    })
  );

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private comm: CommunicationService,
    private userService: UserService,
    private tasksSignalStore: TasksSignalStore,
    private notifications: NotificationsService,
    private translate: TranslateService,
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      date: ['', [Validators.required]],
      time: ['', [Validators.required]],
      assigmentFor: this.fb.group({
        id: [null]
      }),
      status: true,
      labels: this.fb.array([]),
    });
  }

  get labels(): FormArray {
    return this.taskForm.get('labels') as FormArray;
  }

  ngOnInit(): void {
    this.initCurrentUser();
    this.initGroupContext();
  }

  addLabel(value: string, event: Event): void {
    event.preventDefault();
    const label = value.trim();
    if (!label || this.labels.value.includes(label)) return;
    this.labels.push(this.fb.control(label));
  }

  removeLabel(index: number, event: Event): void {
    event.preventDefault();
    this.labels.removeAt(index);
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.submitting.emit(true);

    const payload: any = {
      ...this.taskForm.value,
      labels: this.labels.value,
    };

    if (payload.assigmentFor?.id != null) {
      payload.assigmentFor.id = Number(payload.assigmentFor.id);
    }

    if (this.currentGroupId) {
      payload.groupId = this.currentGroupId;
    }

    this.taskService.createTask(payload).subscribe({
      next: (createdTask) => {
        const taskToAdd = (createdTask && (createdTask as any).id) ? createdTask : payload;
        const currentUserId = localStorage.getItem('userId');
        const assigneeId = taskToAdd?.assigmentFor?.id != null ? String(taskToAdd.assigmentFor.id) : null;
        if (assigneeId && currentUserId && assigneeId === currentUserId) {
          this.tasksSignalStore.add(taskToAdd);
        }

        this.comm.sendNotification({
          source: 'taskForm',
          type: 'success',
          message: this.translate.instant('NOTIFICATIONS.TASK.CREATED') || 'Tarea creada correctamente',
           payload: { refreshTasks: true, taskId: (taskToAdd as any).id ?? null, reason: 'created' }
         });

         const notification: Notification = {
          title: this.translate.instant('NOTIFICATIONS.TASK.TITLE') || 'Tarea creada',
          message: this.translate.instant('NOTIFICATIONS.TASK.MESSAGE', { title: payload.title }) || `La tarea "${payload.title}" se ha creado correctamente.`,
           createdAt: new Date(),
           userEmail: this.email || '',
         };

        this.notifications.pushNotifications(notification).subscribe();
        this.create.emit();
      },
      error: () => {
        this.comm.sendNotification({
          source: 'taskForm',
          type: 'error',
          message: this.translate.instant('NOTIFICATIONS.TASK.CREATE_ERROR') || 'Error al crear la tarea',
        });
      },
      complete: () => {
        this.loading = false;
        this.submitting.emit(false);
      }
    });
  }

  private initCurrentUser(): void {
    const email = localStorage.getItem('email');
    if (!email) return;
    this.userService.getUser(email).subscribe(user => {
      if (!user?.id) return;
      const control = this.taskForm.get('assigmentFor.id');
      const currentValue = control?.value;
      const isDirty = control?.dirty;
      if (currentValue == null && !isDirty) {
        control?.setValue(user.id);
      }
    });
  }

  private initGroupContext(): void {
    this.groupsStore.groups$
      .pipe(map(groups => groups[0] || null))
      .subscribe(group => {
        if (!group) {
          this.groupUsers = [];
          this.currentGroupId = null;
          return;
        }
        this.groupUsers = group.users ?? [];
        this.currentGroupId = group.id ?? null;
        const email = localStorage.getItem('email');
        if (group.adminUser?.email !== email) {
          const currentUser = this.groupUsers.find(u => u.email === email);
          if (currentUser) {
            this.taskForm.patchValue({
              assigmentFor: { id: currentUser.id }
            });
          }
        }
      });
  }
}
