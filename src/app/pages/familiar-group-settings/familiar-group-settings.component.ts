import {Component, DestroyRef, EventEmitter, inject, OnInit, Output, ViewChild} from '@angular/core';
import {ButtonComponent} from '../../components/shared/button/button.component';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {Router} from '@angular/router';
import {CommunicationService} from '../../services/shared/communication.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {GroupsStore} from '../../stores/groups.store';
import {GroupService} from '../../services/group.service';
import {ConfirmModalComponent} from '../../components/shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-familiar-group-user-settings',
  standalone: true,
  imports: [
    ButtonComponent,
    NgIf,
    NgForOf,
    AsyncPipe,
    ConfirmModalComponent
  ],
  templateUrl: './familiar-group-settings.component.html',
  styleUrl: '../../../styles/styles.css',
})
export class FamiliarGroupSettingsComponent implements OnInit{
  constructor(private groupService: GroupService) {
  }
  @Output() createFromEmpty = new EventEmitter<void>();
  private groupsStore = inject(GroupsStore);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private comm = inject(CommunicationService);
  loading = false
  email = localStorage.getItem('email');
  groups$ = this.groupsStore.groups$;

  @ViewChild(ConfirmModalComponent) confirmModal!: ConfirmModalComponent;
  private groupToDelete: any = null;

  ngOnInit(): void {
    this.comm.notifications$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(n => {
        if (n?.payload?.refreshGroups) {
          this.groupsStore.refresh();
        }
      });
    console.log(this.groupsStore.refresh());
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
}
