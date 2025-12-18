import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { ButtonComponent } from '../../components/shared/button/button.component';
import { AuthService } from '../../services/auth.service';
import { User, UserService } from '../../services/user.service';
import { CommunicationService } from '../../services/shared/communication.service';
import { AvatarService } from '../../services/shared/avatar.service';

@Component({
  selector: 'app-user-settings',
  imports: [
    ButtonComponent,
    NgIf,
  ],
  templateUrl: './user-settings.component.html',
  styleUrl: '../../../styles/styles.css',
})
export class UserSettingsComponent implements OnInit {

  user!: User;
  avatar?: string;

  private email = localStorage.getItem('email');

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private comm: CommunicationService,
    private avatarService: AvatarService
  ) {}

  ngOnInit(): void {
    this.loadUser();

    // Suscribirse al avatar global para actualizar automáticamente la vista cuando cambie
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
        this.avatarService.loadAvatar(this.user.id);
        this.cd.detectChanges()
      },
      error: () => console.error('No se pudo cargar el usuario'),
    });
  }

  private reloadAvatar(): void {
    if (!this.user?.id) return;

    this.avatarService.loadAvatar(this.user.id);
  }

  editImageProfile(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: Event) => this.onFileSelected(event);
    input.click();
  }

  private fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Error leyendo archivo'));
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }

  private async onFileSelected(event: Event): Promise<void> {
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

    try {
      const dataUrl = await this.fileToDataUrl(file);
      console.log('[UserSettings] setLocalAvatar (optimistic) for user', this.user.id);
      this.avatarService.setLocalAvatar(this.user.id, dataUrl);
      // asegurarnos de mostrar algo inmediatamente incluso si localStorage falla
      try { this.avatarService.setObjectUrlFromFile(file); } catch (e) { /* ignore */ }
      this.cd.detectChanges();
    } catch (e) {
      console.warn('[UserSettings] No se pudo convertir archivo a dataURL', e);
      // intentar fallback inmediato con objectURL
      try { this.avatarService.setObjectUrlFromFile(file); } catch (err) { console.warn('fallback objectURL fallido', err); }
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log('[UserSettings] subiendo imagen al servidor...');
      await firstValueFrom(this.userService.postImageProfile(this.user.id, formData));
      console.log('[UserSettings] imagen subida, empezando pollForAvatar');
      await this.avatarService.pollForAvatar(this.user.id, 8, 800);
      console.log('[UserSettings] pollForAvatar terminado. Avatar (localStorage):', localStorage.getItem(`avatar_${this.user.id}`));
      this.comm.sendNotification({
        source: 'userForm',
        type: 'success',
        message: 'Imagen subida correctamente.',
        payload: { userId: this.user.id },
      });
      this.cd.detectChanges();
    } catch (err) {
      console.error('[UserSettings] error subiendo imagen o en poll:', err);
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
        this.authService.removeUserData();
        this.authService.loggedInSubject.next(false);
        // limpiar avatar local al eliminar cuenta
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
    this.authService.removeUserData();
    this.authService.loggedInSubject.next(false);
    this.authService.logout();
    this.avatarService.clear(this.user.id);
    this.router.navigate(['/landing']);
  }
}
