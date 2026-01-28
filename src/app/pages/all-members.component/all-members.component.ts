import {Component, DestroyRef, inject, OnInit, ChangeDetectorRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {GroupService, Group} from '../../services/group.service';
import {User} from '../../services/user.service';
import {GroupsStore} from '../../stores/groups.store';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import { AvatarService } from '../../services/shared/avatar.service';

@Component({
  selector: 'app-all-members.component',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule
  ],
  templateUrl: './all-members.component.html',
  styleUrl: '../../../styles/styles.css',
})
export class AllMembersComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private groupService = inject(GroupService);
  private groupsStore = inject(GroupsStore);
  private destroyRef = inject(DestroyRef);
  private translate = inject(TranslateService);
  private avatarService = inject(AvatarService);
  private cd = inject(ChangeDetectorRef);

  loading = true;
  errorMessage: string | null = null;
  group: Group | null = null;
  members: User[] = [];
  backButton = ''
  allMembers = ''

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage = this.translate.instant('group.not_found') || 'Grupo no encontrado';
      this.loading = false;
      return;
    }
    this.loadGroupMembers(id);
  }


  private loadGroupMembers(id: string) {
    this.loading = true;
    this.errorMessage = null;

    // Intentar primero leer desde el store (si existe)
    try {
      this.groupsStore.groups$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(list => {
        const found = list?.find(g => g.id === id);
        if (found) {
          this.group = found;
          this.members = found.users ?? [];
          this.loading = false;
        }
      });
    } catch (e) {
      // ignore
    }

    // Llamada al servicio para asegurar datos actualizados
    this.groupService.getGroup(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (g) => {
        this.group = g;
        this.members = g.users ?? [];
        this.loading = false;
      },
      error: (err) => {
        console.error('[AllMembers] getGroup error', err);
        this.errorMessage = this.translate.instant('group.load_error') || 'No se pudo cargar los miembros del grupo';
        this.loading = false;
      }
    });
  }

  trackById(_index: number, item: User) {
    return item?.id;
  }

  ngOnInit(): void {
    this.setTranslations();
    this.translate.onLangChange.subscribe(() => this.setTranslations());

    // Cuando avatarService emite, forzar detección para actualizar imágenes desde localStorage
    this.avatarService.avatar$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      try { this.cd.detectChanges(); } catch (e) { }
    });
  }

  private setTranslations() {
    this.backButton = this.translate.instant('COMPONENTS.SHARED.BACKBUTTON');
    this.allMembers = this.translate.instant('PAGES.ALLMEMBERS.TITLE');
  }

  getImage(userId?: number | null): string {
    const defaultImg = 'assets/img/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector-removebg-preview.png';
    if (!userId) return defaultImg;
    const key = `avatar_${userId}`;
    const cached = localStorage.getItem(key);
    if (cached) return cached;
    // Trigger background load from the avatar service
    try { this.avatarService.loadAvatar(userId); } catch (e) { }
    return defaultImg;
  }

  public onAvatarError = (event: Event) => {
    try {
      const img = event.target as HTMLImageElement;
      if (!img) return;
      if ((img.dataset as any).errored) return;
      (img.dataset as any).errored = 'true';
      const fallback = 'assets/img/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector-removebg-preview.png';
      if (!img.src.endsWith(fallback)) img.src = fallback;
    } catch (e) {
      // ignore
    }
  }
}
