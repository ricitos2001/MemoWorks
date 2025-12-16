import {Component, EventEmitter, Output, Optional, Host, OnInit, inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ButtonComponent} from '../../components/shared/button/button.component';
import {FormInputComponent} from '../../components/shared/form-input/form-input.component';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {phoneNumberValidation} from '../../validators/phone-number.validator';
import {AsyncValidatorsService} from '../../services/async-validators.service';
import {UserService} from '../../services/user.service';
import {CommunicationService} from '../../services/shared/communication.service';


@Component({
  selector: 'app-edit-user-info',
  imports: [
    ButtonComponent,
    FormInputComponent,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './edit-user-info.component.html',
  styleUrl: '../../../styles/styles.css',
})
export class EditUserInfoComponent implements OnInit {

  editUserForm: FormGroup;

  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder,
    private asyncValidators: AsyncValidatorsService,
    private route: ActivatedRoute,
    private comm: CommunicationService,
  ) {
    this.editUserForm = this.fb.group({
      email: ['', {
        validators: [Validators.required, Validators.email, Validators.maxLength(50)],
        updateOn: 'change'
      }],
      name: ['', [Validators.required, Validators.maxLength(50)]],
      surnames: ['', [Validators.required, Validators.maxLength(100)]],
      username: ['', {
        validators: [Validators.required, Validators.maxLength(50)],
        asyncValidators: [this.asyncValidators.usernameAvailable()],
        updateOn: 'change'
      }],
      phoneNumber: ['', [Validators.required, phoneNumberValidation()]],
      rol: 'USUARIO'
    }, );
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getValues(id);
    }
  }

  getValues(id: string): void {
    this.userService.getUser(id).subscribe({
      next: (user) => {
        if (!user) return;
        this.editUserForm.patchValue({
          email: user.email,
          name: user.name,
          surnames: user.surnames,
          username: user.username,
          phoneNumber: user.phoneNumber,
          rol: user.rol,
        });
        this.editUserForm.markAsPristine();
      },
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.editUserForm.invalid) {
      this.editUserForm.markAllAsTouched();
      return;
    }
    const id = this.route.snapshot.paramMap.get('id');
    const payload = {
      ...this.editUserForm.value,
      labels: this.editUserForm.value,
    };
    this.userService.editUser(id, payload).subscribe({
      next: () => {
        this.comm.sendNotification({
          source: 'userForm',
          type: 'success',
          message: 'Usuario actualizado correctamente',
        });
        this.router.navigate(['/settings/userSettings']);

      },
      error: () => {
        this.comm.sendNotification({
          source: 'userForm',
          type: 'error',
          message: 'Error al editar el usuario',
        });
      }
    });
  }

  cancelEdittion() {
    this.comm.sendNotification({
      source: 'userForm',
      type: 'info',
      message: 'Operacion cancelada',
    });
    this.router.navigate(['/settings/userSettings']);
  }
}

