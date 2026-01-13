import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {User, UserService} from '../services/user.service';
import {Group, GroupService} from '../services/group.service';
import {email} from '@angular/forms/signals';

@Injectable({ providedIn: 'root' })
export class GroupsStore {
  private groupsSubject = new BehaviorSubject<Group[]>([]);
  groups$ = this.groupsSubject.asObservable();

  constructor(private api: GroupService) {
    this.refresh();
  }

  refresh() {
    this.api.getGroupsByUserEmail(localStorage.getItem('email')).subscribe(list => this.groupsSubject.next(list));
  }

  add(group: Group) {
    const current = this.groupsSubject.value;
    this.groupsSubject.next([...current, group]);
  }

  update(group: Group) {
    const current = this.groupsSubject.value;
    this.groupsSubject.next(
      current.map(p => (p.id === group.id ? group : p))
    );
  }

  remove(id: string) {
    const current = this.groupsSubject.value;
    this.groupsSubject.next(current.filter(p => p.id !== id));
  }
}

