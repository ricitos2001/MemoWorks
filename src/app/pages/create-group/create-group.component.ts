import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ReactiveFormsModule} from '@angular/forms';
import { AsyncValidatorsService } from '../../services/async-validators.service';
import { GroupService } from '../../services/group.service';
import { UserService } from '../../services/user.service';
import {ButtonComponent} from '../../components/shared/button/button.component';
import {FormInputComponent} from '../../components/shared/form-input/form-input.component';
import {NgForOf, NgIf} from '@angular/common';
import {TaskService} from '../../services/task.service';
import {CommunicationService} from '../../services/shared/communication.service';
import {TasksSignalStore} from '../../stores/tasks.signal.store';
import {Notification as AppNotification, NotificationsService} from '../../services/notifications.service';
import {Router} from '@angular/router';
import {GroupsStore} from '../../stores/groups.store';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrl: '../../../styles/styles.css',
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    FormInputComponent,
    NgForOf,
    NgIf
  ]
})
export class CreateGroupComponent implements OnInit {
  groupForm: FormGroup;
  loading = false;
  @Output() submitting = new EventEmitter<boolean>();

  constructor(
    private groupService: GroupService,
    private comm: CommunicationService,
    private fb: FormBuilder,
    private userService: UserService,
    private notifications: NotificationsService,
    private router: Router,
    private groupsStore: GroupsStore,

  ) {
    this.groupForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.max(500)]],
      adminUser: { id: null },
      users: this.fb.array([]),
    });
  }

  get users(): FormArray {
    return this.groupForm.get('users') as FormArray;
  }

  addUser(value: string, event: Event): void {
    event.preventDefault();
    const user = value.trim();
    if (!user) return;
    if (this.users.value.includes(user)) return;
    this.users.push(this.fb.control(user));
  }

  removeUser(index: number, event: Event): void {
    event.preventDefault()
    this.users.removeAt(index);
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
        this.groupForm.patchValue({
          adminUser: {id: user.id}
        });
      },
      error: (err) => {
        console.error('ERROR GET USER:', err);
      }
    });
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.groupForm.invalid) {
      this.groupForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.submitting.emit(true);
    const payload = {
      ...this.groupForm.value,
      users: this.users.value
    };

    this.groupService.createGroup(payload).subscribe({
      next: (_createGroup) => {
        this.groupsStore.add(payload);
        this.comm.sendNotification({
          source: 'groupForm',
          type: 'success',
          message: 'Grupo creada correctamente',
          payload: { refreshGroups: true }
        });

        const apiNotification: AppNotification = {
          title: 'Grupo creado',
          message: `La tarea "${payload.title}" se ha creado correctamente.`,
          createdAt: new Date(),
        };
        this.notifications.pushNotifications(apiNotification).subscribe({
          next: () => {},
          error: (err) => { console.warn('Error enviando notificación al API:', err); }
        });
        this.create.emit();
      },
      error: () => {
        this.comm.sendNotification({
          source: 'groupForm',
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

  onCancel(event: Event): void {
    event.preventDefault();
    this.cancel.emit();
    this.router.navigate(['/settings/familiarGroups']);
  }

}
