import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number; // ms; 0 o undefined => persistente hasta dismiss
  createdAt: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastsSubject = new BehaviorSubject<ToastMessage[]>([]);
  public toasts$: Observable<ToastMessage[]> = this.toastsSubject.asObservable();

  private nextId() { return Math.random().toString(36).slice(2, 9); }

  show(message: string, type: ToastType = 'info', duration = 5000) {
    const toast: ToastMessage = {
      id: this.nextId(),
      message,
      type,
      duration,
      createdAt: Date.now()
    };
    this.toastsSubject.next([...this.toastsSubject.getValue(), toast]);
    return toast.id;
  }

  success(message: string, duration?: number) { return this.show(message, 'success', duration ?? 4000); }
  error(message: string, duration?: number) { return this.show(message, 'error', duration ?? 8000); }
  info(message: string, duration?: number) { return this.show(message, 'info', duration ?? 3000); }
  warning(message: string, duration?: number) { return this.show(message, 'warning', duration ?? 6000); }

  dismiss(id: string) {
    this.toastsSubject.next(this.toastsSubject.getValue().filter(t => t.id !== id));
  }

  clearAll() {
    this.toastsSubject.next([]);
  }
}
