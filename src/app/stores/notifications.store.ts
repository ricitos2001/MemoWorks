import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Subscription} from 'rxjs';
import {Notification, NotificationsService} from '../services/notifications.service';
import {AuthService} from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class NotificationsStore implements OnDestroy {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  private authSub?: Subscription;
  private pollSub?: Subscription;

  constructor(private api: NotificationsService, private auth: AuthService) {
    this.authSub = this.auth.loggedIn$.subscribe(logedIn => {
      if (logedIn) {
        this.refresh();
      }
    });
  }

  refresh() {
    this.pollSub?.unsubscribe();
    this.pollSub = this.api.pollNotifications().subscribe(list => this.notificationsSubject.next(list));
  }

  add(notification: Notification) {
    const current = this.notificationsSubject.value;
    this.notificationsSubject.next([...current, notification]);
  }

  clear() {
    this.notificationsSubject.next([]);
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
    this.pollSub?.unsubscribe();
  }
}
