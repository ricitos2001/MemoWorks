import {Component, computed, DestroyRef, EventEmitter, inject, OnInit, Output} from '@angular/core';
import {ButtonComponent} from '../../components/shared/button/button.component';
import {AsyncPipe, JsonPipe, NgForOf, NgIf} from '@angular/common';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {TasksSignalStore} from '../../stores/tasks.signal.store';
import {CommunicationService} from '../../services/shared/communication.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {GroupsStore} from '../../stores/groups.store';
import {UserService} from '../../services/user.service';
import {GroupService} from '../../services/group.service';

@Component({
  selector: 'app-familiar-group-user-settings',
  standalone: true,
  imports: [
    ButtonComponent,
    NgIf,
    NgForOf,
    AsyncPipe

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

  ngOnInit(): void {
    this.comm.notifications$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(n => {
        if (n?.payload?.refreshTasks) {
          this.groups$
        }
      });
  }

  trackById(index: number, task: any) {
    return task.id;
  }

  createGroup() {
    this.router.navigate(['/createGroup']);
  }

  leaveGroup(group: any) {
    if (!this.email) return;

    const isAdmin = group.adminUser?.email === this.email;

    this.loading = true;

    if (isAdmin) {
      // 🔴 ADMIN → eliminar grupo
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
      // 🟢 USUARIO NORMAL → salir del grupo
      const updatedUsers = group.users.filter(
        (u: any) => u.email !== this.email
      );

      this.groupService.editGroup(group.id, updatedUsers)
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

}
