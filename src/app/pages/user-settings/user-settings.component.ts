import { ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { ButtonComponent } from '../../components/shared/button/button.component';
import { AuthService } from '../../services/auth.service';
import { User, UserService } from '../../services/user.service';
import { CommunicationService } from '../../services/shared/communication.service';
import { AvatarService } from '../../services/shared/avatar.service';
import { ToastService } from '../../services/shared/toast.service';
import { NotificationsStore } from '../../stores/notifications.store';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-user-settings',
  imports: [
    ButtonComponent,
    NgIf,
    TranslateModule,
  ],
  templateUrl: './user-settings.component.html',
  styleUrl: '../../../styles/styles.css',
})
export class UserSettingsComponent implements OnInit {

  user!: User;
  avatar?: string;

  private email = localStorage.getItem('email');

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private comm: CommunicationService,
    private avatarService: AvatarService,
    private renderer: Renderer2,
    private toastService: ToastService,
    private notificationsStore: NotificationsStore,
    private translate: TranslateService,
  ) {}

  name: string = '';
  surnames: string = '';
  usernameText: string = '';
  phoneNumber: string = '';
  userEmail: string = '';
  imageProfileText: string = '';
  editImageProfileButton: string = '';
  editUserInfoButton: string = ''
  closeSessionButton: string = '';
  removeAccountButton: string = '';

  ngOnInit(): void {
    this.loadUser();
    this.avatarService.avatar$.subscribe(payload => {
      this.avatar = payload?.src ?? undefined;
      this.cd.detectChanges();
    });

    this.comm.notifications$.subscribe(notification => {
      if (
        notification &&
        notification.source === 'userForm' &&
        notification.type === 'success' &&
        notification.payload?.userId === this.user?.id
      ) {
        this.cd.detectChanges();
        this.reloadAvatar();
      }
    });
    this.setTranslations();
    this.translate.onLangChange.subscribe(() => this.setTranslations());
  }

  onAvatarImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/img/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector-removebg-preview.png';
  }

  private loadUser(): void {
    if (!this.email) return;
    this.userService.getUser(this.email).subscribe({
      next: user => {
        this.user = user;
        // Cargar avatar: si ya existe en localStorage, loadAvatar omitirá la petición remota.
        this.avatarService.loadAvatar(this.user.id);
        this.cd.detectChanges()
      },
      error: () => console.error('No se pudo cargar el usuario'),
    });
  }

  private reloadAvatar(): void {
    if (!this.user?.id) return;

    // Forzar fetch remoto para asegurarnos de tener la versión actualizada tras cambios.
    this.avatarService.loadAvatar(this.user.id, true);
  }

  editImageProfile(): void {
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
      this.fileInput.nativeElement.click();
      return;
    }
    const input = this.renderer.createElement('input');
    this.renderer.setProperty(input, 'type', 'file');
    this.renderer.setProperty(input, 'accept', 'image/*');
    const unregister = this.renderer.listen(input, 'change', (event: Event) => {
      try { this.onFileSelected(event); } finally { unregister(); }
    });
    if ((input as any).click) { (input as any).click(); }
  }
  private fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Error leyendo archivo'));
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length || !this.user?.id) return;
    const file = input.files[0];
    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      this.comm.sendNotification({
        source: 'userForm',
        type: 'error',
        message: 'El archivo supera el tamaño máximo de 5MB.',
      });
      return;
    }
    if (!file.type.startsWith('image/')) {
      this.comm.sendNotification({
        source: 'userForm',
        type: 'error',
        message: 'Solo se permiten archivos de imagen.',
      });
      return;
    }
    const dataUrl = await this.fileToDataUrl(file);
    this.avatarService.setLocalAvatar(this.user.id, dataUrl);
    this.avatarService.setObjectUrlFromFile(file);
    this.cd.detectChanges();
    const formData = new FormData();
    formData.append('file', file);

    try {
      await firstValueFrom(this.userService.postImageProfile(this.user.id, formData));
      await this.avatarService.pollForAvatar(this.user.id, 8, 800);
      this.comm.sendNotification({
        source: 'userForm',
        type: 'success',
        message: 'Imagen subida correctamente.',
        payload: { userId: this.user.id },
      });
      this.cd.detectChanges();
    } catch (err) {
      this.comm.sendNotification({
        source: 'userForm',
        type: 'error',
        message: 'Error al subir la imagen.',
      });
      this.avatarService.clear(this.user.id);
    }
  }

  editUserInfo(): void {
    this.router.navigate(['/editUserInfo', this.user.id]);
  }

  removeAccount(): void {
    if (!this.user?.id) return;

    this.userService.removeUser(this.user.id).subscribe({
      next: () => {
        this.comm.sendNotification({
          source: 'userForm',
          type: 'success',
          message: 'Usuario eliminado correctamente',
        });
        this.toastService.dismissAll();
        this.notificationsStore.clear();
        this.authService.removeUserData();
        this.authService.loggedInSubject.next(false);
        this.avatarService.clear(this.user.id);
        this.router.navigate(['/landing']);
      },
      error: () => {
        this.comm.sendNotification({
          source: 'userForm',
          type: 'error',
          message: 'Error al eliminar el usuario',
        });
      }
    });
  }

  logout(): void {
    this.toastService.dismissAll();
    if (this.user?.id) {
      this.notificationsStore.clear();
    }
    this.authService.removeUserData();
    this.authService.loggedInSubject.next(false);
    this.authService.logout();
    this.avatarService.clear(this.user.id);
    this.router.navigate(['/landing']);
  }

  private setTranslations() {
    this.name = this.translate.instant('PAGES.SETTINGS.USERSETTINGS.NAME');
    this.surnames = this.translate.instant('PAGES.SETTINGS.USERSETTINGS.SURNAMES');
    this.usernameText = this.translate.instant('PAGES.SETTINGS.USERSETTINGS.USERNAMETEXT');
    this.phoneNumber = this.translate.instant('PAGES.SETTINGS.USERSETTINGS.PHONENUMBER');
    this.userEmail = this.translate.instant('PAGES.SETTINGS.USERSETTINGS.USEREMAIL');
    this.imageProfileText = this.translate.instant('PAGES.SETTINGS.USERSETTINGS.IMAGEPROFILETEXT');
    this.editImageProfileButton = this.translate.instant('PAGES.SETTINGS.USERSETTINGS.EDITIMAGEPROFILEBUTTON');
    this.editUserInfoButton = this.translate.instant('PAGES.SETTINGS.USERSETTINGS.EDITUSERINFOBUTTON');
    this.closeSessionButton = this.translate.instant('PAGES.SETTINGS.USERSETTINGS.CLOSESESSIONBUTTON');
    this.removeAccountButton = this.translate.instant('PAGES.SETTINGS.USERSETTINGS.REMOVEACCOUNTBUTTON')
  }
}
