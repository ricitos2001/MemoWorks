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

  viewDetails(taskId: string) {
    this.router.navigate(['/task', taskId], { state: { fromCalendar: false } });
  }

  createGroup() {
    this.router.navigate(['/createGroup']);
  }

  leaveGroup() {
    // TODO implementar funcionalidad para salir de un grupo
  }
}
