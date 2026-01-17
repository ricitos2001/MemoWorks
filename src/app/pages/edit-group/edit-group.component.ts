import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ButtonComponent} from "../../components/shared/button/button.component";
import {FormInputComponent} from "../../components/shared/form-input/form-input.component";
import {NgForOf, NgIf} from "@angular/common";
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {GroupService} from '../../services/group.service';
import {CommunicationService} from '../../services/shared/communication.service';
import {User, UserService} from '../../services/user.service';
import {Notification as AppNotification, NotificationsService} from '../../services/notifications.service';
import {ActivatedRoute, Router} from '@angular/router';
import {GroupsStore} from '../../stores/groups.store';

@Component({
  selector: 'app-edit-group',
    imports: [
        ButtonComponent,
        FormInputComponent,
        NgForOf,
        NgIf,
        ReactiveFormsModule
    ],
  templateUrl: './edit-group.component.html',
  styleUrl: '../../../styles/styles.css',
})
export class EditGroupComponent implements OnInit {
  groupForm: FormGroup;
  loading = false;
  userNotFound = false;
  userAlreadyAdded = false;
  adminUserId: number | null = null;
  email = localStorage.getItem('email');
  @Output() submitting = new EventEmitter<boolean>();

  constructor(
    private groupService: GroupService,
    private comm: CommunicationService,
    private fb: FormBuilder,
    private userService: UserService,
    private notifications: NotificationsService,
    private router: Router,
    private groupsStore: GroupsStore,
    private route: ActivatedRoute,

  ) {
    this.groupForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      adminUser: { id: null },
      users: this.fb.array<FormGroup>([]),
    });
  }

  get users(): FormArray<FormGroup> {
    return this.groupForm.get('users') as FormArray<FormGroup>;
  }

  addUser(username: string, event: Event): void {
    event.preventDefault();
    const value = username.trim();
    if (!value) return;
    this.userNotFound = false;
    this.userAlreadyAdded = false;
    const exists = this.users.value.some(u => u.username === value);
    if (exists) {
      this.userAlreadyAdded = true;
      return;
    }
    this.userService.getUserByName(value).subscribe({
      next: (user) => {
        if (!user?.id) {
          this.userNotFound = true;
          return;
        }
        if (user.id === this.groupForm.value.adminUser?.id) return;
        const userGroup = this.fb.group({
          id: [user.id],
          username: [user.username],
        });
        this.users.push(userGroup);
      },
      error: () => {
        this.userNotFound = true;
      },
    });
  }
  removeUser(index: number, event: Event): void {
    event.preventDefault()
    this.users.removeAt(index);
  }

  @Output() cancel = new EventEmitter<void>();
  @Output() create = new EventEmitter<void>();

  getValues(id: string): void {
    this.groupService.getGroup(id).subscribe({
      next: (group) => {
        if (!group) return;
        this.groupForm.patchValue({
          name: group.name,
          description: group.description,
          adminUser: group.adminUser,
        });
        this.users.clear();
        if (Array.isArray(group.users)) {
          group.users.forEach((user: User) => {
            this.users.push(
              this.fb.group({
                id: [user.id],
                username: [user.username],
              })
            );
          });
        }
        this.groupForm.markAsPristine();
      },
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getValues(id);
    }
    const email = localStorage.getItem('email');
    if (!email) return;
    this.userService.getUser(email).subscribe({
      next: (user) => {
        if (!user?.id) return;
        this.groupForm.patchValue({
          adminUser: { id: user.id },
        });
        this.addAdminToForm({
          id: user.id,
          username: user.username,
        });
        this.adminUserId = user.id;
      },
      error: (err) => {
        console.error('ERROR GET USER:', err);
      },
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
    const id = this.route.snapshot.paramMap.get('id');
    this.groupService.editGroup(id, payload).subscribe({
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
          userEmail: this.email || '',
        };
        this.notifications.pushNotifications(apiNotification).subscribe({
          next: () => {},
          error: (err) => { console.warn('Error enviando notificación al API:', err); }
        });
        this.create.emit();
        this.router.navigate(['/settings/familiarGroups']);
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

  private addAdminToForm(user: { id: number; username: string }): void {
    const exists = this.users.value.some(
      (u: User) => u.id === user.id
    );
    if (exists) return;
    const userGroup = this.fb.group({
      id: [user.id],
      username: [user.username],
    });
    this.users.push(userGroup);
  }
}
