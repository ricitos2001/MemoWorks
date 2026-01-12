import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Notification, NotificationsService} from '../services/notifications.service';

@Injectable({ providedIn: 'root' })
export class NotificationsStore {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  constructor(private api: NotificationsService) {
    this.refresh();
  }

  refresh() {
    this.api.pollNotifications().subscribe(list => this.notificationsSubject.next(list));
  }

  add(notification: Notification) {
    const current = this.notificationsSubject.value;
    this.notificationsSubject.next([...current, notification]);
  }

  clear() {
    this.notificationsSubject.next([]);
  }
}
