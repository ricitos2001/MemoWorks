import {Component, ElementRef, inject, OnDestroy, OnInit, ViewChild, signal, ChangeDetectorRef} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {NotificationsService, Notification} from '../../../services/notifications.service';
import {NotificationsStore} from '../../../stores/notifications.store';

@Component({
  selector: 'app-notification',
  imports: [
    DatePipe,
    NgForOf,
    NgIf
  ],
  templateUrl: './notification.component.html',
  styleUrl: '../../../../styles/styles.css',
})
export class NotificationComponent implements OnInit, OnDestroy {
  notificationsService = inject(NotificationsService);
  notificationsStore = inject(NotificationsStore);
  state = signal<{ loading: boolean; data: Notification[]; page: number; eof: boolean }>({
    loading: false,
    data: [],
    page: 0,
    eof: false
  });

  @ViewChild('anchor', { static: true }) anchor!: ElementRef<HTMLElement>;
  private observer!: IntersectionObserver;
  email = localStorage.getItem('email');

  trackById(index: number, notification: Notification) {
    return notification.id;
  }

  ngOnInit() {
    this.notificationsStore.refresh();
    this.notificationsService.pollNotifications(30000, this.email).subscribe(list => {
      const current = this.state().data;
      const ids = new Set(current.map(n => n.id));
      const newItems = list.filter(n => n.id && !ids.has(n.id));
      if (newItems.length) {
        this.state.set({ ...this.state(), data: [...newItems, ...this.state().data] });
      }
    });

    this.observer = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) {
        this.loadMore();
      }
    });

    setTimeout(() => {
      if (this.anchor && this.anchor.nativeElement) {
        this.observer.observe(this.anchor.nativeElement);
      }
    });

    this.loadMore();
  }

  loadMore() {
    const { loading, page, eof } = this.state();
    if (loading || eof) return;

    this.state.set({ ...this.state(), loading: true });

    const nextPage = page + 1; // empecemos en página 1
    this.notificationsService.getPage(nextPage, 20, this.email).subscribe(res => {
      const items = res.content || [];
      const existingIds = new Set(this.state().data.map(n => n.id));
      const merged = [...this.state().data, ...items.filter(i => i.id && !existingIds.has(i.id))];

      this.state.set({
        loading: false,
        data: merged,
        page: nextPage,
        eof: items.length === 0
      });
    }, () => {
      this.state.set({ ...this.state(), loading: false });
    });
  }

  ngOnDestroy() {
    if (this.observer) this.observer.disconnect();
  }
}
