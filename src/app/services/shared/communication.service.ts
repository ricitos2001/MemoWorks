import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

export interface AppNotification {
  source: 'taskForm' | 'dashboard' | 'userForm';
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  payload?: any;
  timestamp?: number;
}


@Injectable({
  providedIn: 'root',
})

export class CommunicationService {
  private notificationSubject = new BehaviorSubject<AppNotification | null>(null);
  public notifications$: Observable<AppNotification | null> = this.notificationSubject.asObservable();

  sendNotification(notification: AppNotification): void {
    this.notificationSubject.next({
      ...notification,
      timestamp: Date.now()
    });
  }
}
