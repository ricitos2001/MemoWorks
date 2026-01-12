import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RealtimeService {
  private socket$: WebSocketSubject<any> | null = null;

  connect(url = 'wss://api.miapp.com/ws/notifications'): WebSocketSubject<any> {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = webSocket(url);
    }
    return this.socket$;
  }

  listen<T>(): Observable<T> {
    return this.connect().asObservable();
  }

  send(message: unknown) {
    this.connect().next(message);
  }

  close() {
    this.socket$?.complete();
    this.socket$ = null;
  }
}
