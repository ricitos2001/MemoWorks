import {Component, DestroyRef, EventEmitter, inject, OnInit, Output, ViewChild, Renderer2, ChangeDetectorRef} from '@angular/core';
import {ButtonComponent}from '../../components/shared/button/button.component';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {CommunicationService} from '../../services/shared/communication.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {GroupsStore} from '../../stores/groups.store';
import {GroupService, Group} from '../../services/group.service';
import {ConfirmModalComponent} from '../../components/shared/confirm-modal/confirm-modal.component';
import { AvatarService } from '../../services/shared/avatar.service';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs/operators';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-familiar-group-user-settings',
  standalone: true,
  imports: [
    ButtonComponent,
    NgIf,
    NgForOf,
    AsyncPipe,
    ConfirmModalComponent,
    TranslateModule,
  ],
  templateUrl: './familiar-group-settings.component.html',
  styleUrl: '../../../styles/styles.css',
})
export class FamiliarGroupSettingsComponent implements OnInit{
  constructor(private groupService: GroupService, private avatarService: AvatarService, private renderer: Renderer2, private cd: ChangeDetectorRef, private translate: TranslateService) {
  }
  @Output() createFromEmpty = new EventEmitter<void>();
  private groupsStore = inject(GroupsStore);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private comm = inject(CommunicationService);
  private auth = inject(AuthService);
  loading = false


  // leer email dinámicamente para que el componente reaccione a login/logout sin recargar
  get email(): string | null { return localStorage.getItem('email'); }
  groups$ = this.groupsStore.groups$;
  @ViewChild(ConfirmModalComponent) confirmModal!: ConfirmModalComponent;
  private groupToDelete: any = null;

  groupName = '';
  groupDescription = '';
  editGroupImageButton = '';
  viewMembersText = '';
  viewMembersButton = '';
  leavelGroupButton = '';
  editGroupButton = '';
  removeGroupButton = '';
  createGroupButton = '';
  createGroupText1 = '';
  createGroupText2 = '';
  createGroupText3 = '';

  ngOnInit(): void {
    // Si el usuario se loguea en runtime, refrescar grupos (y por tanto las imágenes protegidas)
    this.auth.loggedIn$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(logged => {
      if (logged) {
        try { this.groupsStore.refresh(); } catch (e) {}
      }
    });

    // Cuando la lista de grupos cambie, intentar precargar imágenes protegidas (evita tener que recargar página)
    this.groups$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(groups => {
      if (!groups || groups.length === 0) return;
      for (const g of groups) {
        try {
          const key = `group_${g.id}`;
          if (!localStorage.getItem(key)) this.ensureGroupImageLoaded(g);
        } catch (e) {}
      }
    });

    this.comm.notifications$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(n => {
        if (n?.payload?.refreshGroups) {
          this.groupsStore.refresh();
        }
      });

    this.setTranslations();
    this.translate.onLangChange.subscribe(() => this.setTranslations());
  }

  trackById(index: number, task: any) {
    return task.id;
  }

  createGroup() {
    this.router.navigate(['/createGroup']);
  }

  leaveGroup(group: any) {
    if (!this.email) return;
    const isAdmin = group.adminUser.email === this.email;
    this.loading = true;
    if (isAdmin) {
      const remainingUsers = group.users.filter(
        (u: any) => u.email !== this.email
      );
      if (remainingUsers.length === 0) {
        this.groupService.removeGroup(group.id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.groupsStore.refresh();
              this.router.navigate(['/settings']);
            },
            error: () => this.loading = false
          });
      } else {
        const newAdmin = remainingUsers[0];
        const updatedGroup = {
          ...group,
          adminUser: { id: newAdmin.id, email: newAdmin.email },
          users: remainingUsers
        };
        this.groupService.editGroup(group.id, updatedGroup)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.groupsStore.refresh();
              this.router.navigate(['/settings']);
            },
            error: () => this.loading = false
          });
      }
    } else {
      const updatedUsers = group.users.filter(
        (u: any) => u.email !== this.email
      );
      const updatedGroup = { ...group, users: updatedUsers };
      this.groupService.editGroup(group.id, updatedGroup)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.groupsStore.refresh();
            this.router.navigate(['/settings']);
          },
          error: () => this.loading = false
        });
    }
  }

  deleteGroup(group: any) {
    if (!group?.id) return;
    this.groupToDelete = group;
    const message = `¿Estás seguro de que quieres eliminar el grupo "${group.name}"?`;
    if (!this.confirmModal) {
      const confirmDelete = confirm(message);
      if (!confirmDelete) return;
      this.proceedDeleteGroup();
      return;
    }

    this.confirmModal.open(message, 'Eliminar grupo');
    const sub = this.confirmModal.confirmed.subscribe(() => {
      sub.unsubscribe();
      this.proceedDeleteGroup();
    });
  }

  private proceedDeleteGroup() {
    const group = this.groupToDelete;
    if (!group?.id) return;
    this.loading = true;
    this.groupService.removeGroup(group.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.groupsStore.remove(group.id);
          this.router.navigate(['/settings/familiarGroups']);
          this.loading = false;
        },
        error: (err) => {
          console.error('Error eliminando grupo:', err);
          this.loading = false;
          alert('No se pudo eliminar el grupo. Intenta de nuevo.');
        }
      });
  }

  editGroup(groupId: string) {
    this.router.navigate(['/editGroup', groupId]);
  }

  public editGroupImage(group: Group): void {
    void this.editGroupImageInternal(group);
  }

  private async editGroupImageInternal(group: Group): Promise<void> {
     if (!group?.id) return;
    const el = document.getElementById(`groupFileInput_${group.id}`) as HTMLInputElement | null;
    if (el) {
      el.value = '';
      el.click();
      return;
    }

     const input = this.renderer.createElement('input');
     this.renderer.setAttribute(input, 'type', 'file');
     this.renderer.setAttribute(input, 'accept', 'image/*');
    const unregister = this.renderer.listen(input, 'change', (event: Event) => {
      this.handleGroupFileChange(event, group, unregister);
    });
    if ((input as any).click) (input as any).click();
   }

  private async handleGroupFileChange(
    event: Event,
    group: Group,
    unregister: () => void
  ): Promise<void> {
    try {
      await this.onGroupFileSelected(event, group);
    } finally {
      unregister();
    }
  }

  async onGroupFileSelected(event: Event, group: Group): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length || !group?.id) return;
    const file = input.files[0];
    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      this.comm.sendNotification({ source: 'groupForm', type: 'error', message: 'El archivo supera el tamaño máximo de 5MB.' });
      return;
    }
    if (!file.type.startsWith('image/')) {
      this.comm.sendNotification({ source: 'groupForm', type: 'error', message: 'Solo se permiten archivos de imagen.' });
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
      this.loading = true;
      await firstValueFrom(this.groupService.postImage(group.id, formData));
      for (let i = 0; i < 8; i++) {
        try {
          const blob = await firstValueFrom(this.groupService.getImage(group.id, true));
          if (blob && blob.size > 0) {
            const dataUrl = await this.avatarService.blobToDataURLPublic(blob);
            const key = `group_${group.id}`;
            try {
              this.avatarService.saveDataUrlToLocalKey(key, dataUrl);
            } catch (e) { /* ignore */ }
            try { group.image = dataUrl; this.cd.detectChanges(); } catch (e) { }
            this.comm.sendNotification({ source: 'groupForm', type: 'success', message: 'Imagen de grupo actualizada.' });
            this.loading = false;
            return;
          }
        } catch (err) {
          await new Promise(res => setTimeout(res, 800));
        }
      }

      this.comm.sendNotification({ source: 'groupForm', type: 'error', message: 'No se pudo obtener la imagen del servidor tras subirla.' });
    } catch (err) {
      console.error('[FamiliarGroupSettings] error subiendo imagen de grupo:', err);
      this.comm.sendNotification({ source: 'groupForm', type: 'error', message: 'Error al subir la imagen del grupo.' });
    } finally {
      this.loading = false;
    }
  }

  getImage(userId?: number | null): string {
    const defaultImg = 'assets/img/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector-removebg-preview.png';
    if (!userId) return defaultImg;
    const key = `avatar_${userId}`;
    const cached = localStorage.getItem(key);
    if (cached) return cached;
    this.avatarService.loadAvatar(userId);
    return defaultImg;
  }

  // Normalize group.image paths so the browser no longer requests them from the Angular dev server root
  getGroupImage(group: Group | any): string {
    const defaultImg = 'assets/img/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector-removebg-preview.png';
    if (!group) return defaultImg;
    const key = `group_${group.id}`;
    const cached = localStorage.getItem(key);
    if (cached) return cached;

    const img = group.image;
    if (!img) {
      // Trigger background load from API if we have an id
      if (group?.id) this.ensureGroupImageLoaded(group);
      return defaultImg;
    }

    // If it's a data URL already
    if (typeof img === 'string') {
      if (img.startsWith('data:')) return img;

      // If it's an absolute url, it might be protected (401) — fetch it via API instead
      if (img.startsWith('http://') || img.startsWith('https://')) {
        // try to fetch via API if we have group id
        if (group?.id) this.ensureGroupImageLoaded(group);
        return defaultImg;
      }

      // If the backend returned a path starting with '/', or a relative path, fetch via API
      if (img.startsWith('/') || img.includes('/uploads/')) {
        if (group?.id) this.ensureGroupImageLoaded(group);
        return defaultImg;
      }

      // As fallback, return the string (encoded)
      try { return encodeURI(img); } catch (e) { return img; }
    }
    return defaultImg;
  }

  private _loadingGroups = new Set<number | string>();

  private async ensureGroupImageLoaded(group: Group | any): Promise<void> {
    if (!group?.id) return;
    const key = `group_${group.id}`;
    if (localStorage.getItem(key)) return;
    if (this._loadingGroups.has(group.id)) return; // already loading
    this._loadingGroups.add(group.id);
    try {
      // Si no hay token en este momento, esperar a que el usuario haga login
      if (!localStorage.getItem('token')) {
        try {
          console.log('[FamiliarGroupSettings] no token presente, esperando login antes de pedir imagen para group', group.id);
          await firstValueFrom(this.auth.loggedIn$.pipe(filter(Boolean)));
          console.log('[FamiliarGroupSettings] login detectado, procediendo a pedir imagen para group', group.id);
        } catch (e) {
          // si algo falla esperando al login, salir temprano
          console.warn('[FamiliarGroupSettings] espera token cancelada o fallida', e);
          this._loadingGroups.delete(group.id);
          return;
        }
      } else {
        console.log('[FamiliarGroupSettings] token ya presente, pidiendo imagen para group', group.id);
      }
      const blob = await firstValueFrom(this.groupService.getImage(group.id, true));
      console.log('[FamiliarGroupSettings] respuesta getImage para group', group.id, 'blob size=', blob?.size);
      if (blob && blob.size > 0) {
        try {
          const dataUrl = await this.avatarService.blobToDataURLPublic(blob);
          try { localStorage.setItem(key, dataUrl); } catch (e) { /* ignore storage errors */ }
          try { group.image = dataUrl; this.cd.detectChanges(); } catch (e) { }
        } catch (err) {
          console.error('[FamiliarGroupSettings] error converting blob to dataURL', err);
        }
      }
    } catch (err) {
      console.warn('[FamiliarGroupSettings] no se pudo obtener imagen protegida para group', group?.id, err);
    } finally {
      this._loadingGroups.delete(group.id);
    }
  }

  onGroupImgError(event: Event, group: Group | any): void {
    try {
      const imgEl = event.target as HTMLImageElement;
      if (!imgEl) return;
      const src = imgEl.src || '';
      console.warn('[FamiliarGroupSettings] imagen fallo al cargar para group=', group?.id ?? group?.name ?? '<unknown>', ' src=', src);

      // If src is not encoded, try re-encoding it once
      try {
        const decoded = decodeURI(src);
        const reencoded = encodeURI(decoded);
        if (reencoded !== src) {
          console.info('[FamiliarGroupSettings] reintentando con URL codificada:', reencoded);
          imgEl.src = reencoded;
          return;
        }
      } catch (e) {
        // ignore decode errors
      }

      // Si falla, usar fallback por defecto
      imgEl.src = 'assets/img/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector-removebg-preview.png';
    } catch (err) {
      console.error('[FamiliarGroupSettings] onGroupImgError error', err);
    }
  }

  private setTranslations() {
    this.groupName = this.translate.instant('PAGES.SETTINGS.FAMILIARGROUPSETTINGS.GROUPNAME');
    this.groupDescription = this.translate.instant('PAGES.SETTINGS.FAMILIARGROUPSETTINGS.GROUPDESCRIPTION');
    this.editGroupImageButton = this.translate.instant('PAGES.SETTINGS.FAMILIARGROUPSETTINGS.EDITGROUPIMAGEBUTTON');
    this.viewMembersText = this.translate.instant('PAGES.SETTINGS.FAMILIARGROUPSETTINGS.VIEWMEMBERSTEXT');
    this.viewMembersButton = this.translate.instant('PAGES.SETTINGS.FAMILIARGROUPSETTINGS.VIEWMEMBERSBUTTON');
    this.leavelGroupButton = this.translate.instant('PAGES.SETTINGS.FAMILIARGROUPSETTINGS.LEAVEGROUPBUTTON');
    this.editGroupButton = this.translate.instant('PAGES.SETTINGS.FAMILIARGROUPSETTINGS.EDITGROUPBUTTON');
    this.removeGroupButton = this.translate.instant('PAGES.SETTINGS.FAMILIARGROUPSETTINGS.REMOVEGROUPBUTTON');
    this.createGroupButton = this.translate.instant('PAGES.SETTINGS.FAMILIARGROUPSETTINGS.CREATEGROUPBUTTON');
    this.createGroupText1 = this.translate.instant('PAGES.SETTINGS.FAMILIARGROUPSETTINGS.CREATEGROUPTEXT1');
    this.createGroupText2 = this.translate.instant('PAGES.SETTINGS.FAMILIARGROUPSETTINGS.CREATEGROUPTEXT2');
    this.createGroupText3 = this.translate.instant('PAGES.SETTINGS.FAMILIARGROUPSETTINGS.CREATEGROUPTEXT3');
  }
}
