import {Component, EventEmitter, Host, Optional, Output} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {ButtonComponent} from '../../components/shared/button/button.component';
import {FormInputComponent} from '../../components/shared/form-input/form-input.component';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {passwordMatch} from '../../validators/password-match.validator';
import {passwordStrength} from '../../validators/password-strength.validator';
import {phoneNumberValidation} from '../../validators/phone-number.validator';
import {AsyncValidatorsService} from '../../services/async-validators.service';
import {AuthModalComponent} from '../../components/shared/auth-modal/auth-modal.component';
import {ToastService} from '../../services/toast.service';
import {Notification, NotificationsService} from '../../services/notifications.service';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  imports: [
    ButtonComponent,
    FormInputComponent,
    ReactiveFormsModule,
    NgIf,
    TranslateModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: '../../../styles/styles.css',
  standalone: true
})
export class RegisterComponent {
  @Output() authSuccess = new EventEmitter<void>();
  submitted = false;
  registerForm: FormGroup;
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private asyncValidators: AsyncValidatorsService,
    private toast: ToastService,
    private notifications: NotificationsService,
    private translate: TranslateService,
    @Optional() @Host() private authModal?: AuthModalComponent,
  ) {
    this.registerForm = this.fb.group({
      email: ['', {
        validators: [Validators.required, Validators.email, Validators.maxLength(50)],
        asyncValidators: [this.asyncValidators.emailUnique()],
        updateOn: 'blur'
      }],
      name: ['', [Validators.required, Validators.maxLength(50)]],
      surnames: ['', [Validators.required, Validators.maxLength(100)]],
      username: ['', {
        validators: [Validators.required, Validators.maxLength(50)],
        asyncValidators: [this.asyncValidators.usernameAvailable()],
        updateOn: 'blur'
      }],
      phoneNumber: ['', [Validators.required, phoneNumberValidation()]],
      password: ['', [Validators.required, passwordStrength()]],
      repeatPassword: ['', Validators.required],
      rol: 'USUARIO'
    }, { validators: passwordMatch('password', 'repeatPassword') });
  }

  onSubmit(event: Event) {
    event.preventDefault();

    this.submitted = true;
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.authService.register(this.registerForm.value).subscribe({
      next: (res) => {
        if (res?.token) {
          this.authService.saveToken(res.token);
          this.authService.getUserIdFromToken();
          this.toast.show({ type: 'success', message: this.translate.instant('NOTIFICATIONS.AUTH.REGISTER.SUCCESS') || 'Registro correcto', duration: 4000 });
          this.authSuccess.emit();
          const apiNotification: Notification = {
            title: this.translate.instant('NOTIFICATIONS.AUTH.REGISTER.TITLE'),
            message: this.translate.instant('NOTIFICATIONS.AUTH.REGISTER.MESSAGE', { email: this.registerForm.value.email }),
             createdAt: new Date(),
             userEmail: this.registerForm.value.email,
           };
           this.notifications.pushNotifications(apiNotification).subscribe({
             next: () => {},
             error: (err) => { console.warn('Error enviando notificación al API:', err); }
           });
           this.router.navigate(['dashboard']);
         } else {
          this.toast.show({ type: 'error', message: this.translate.instant('NOTIFICATIONS.AUTH.REGISTER.INVALID_RESPONSE') || 'Respuesta de registro inválida' , duration: 4000});
         }
       },
       error: (err) => {
         console.error('Error en registro', err);
         const msg = err?.error?.message || this.translate.instant('NOTIFICATIONS.AUTH.REGISTER.ERROR') || 'Error al registrar usuario';
         this.toast.show({ type: 'error', message: msg, duration: 6000 });
       },
       complete: () => {
         this.loading = false;
       }
     });
   }

   openLogin(event: Event) {
     event.preventDefault();
     if (this.authModal) {
       this.authModal.open('login');
     } else {
       this.router.navigate(['/login']);
     }
   }

   close(event: Event) {
     event.preventDefault();
     if (this.authModal) {
       this.authModal.close();
     } else {
       this.router.navigate(['/']);
     }
   }
 }
