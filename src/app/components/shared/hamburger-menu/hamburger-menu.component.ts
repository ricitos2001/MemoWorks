import {Component, ElementRef, HostListener, OnInit, ViewChild, Renderer2, OnDestroy} from '@angular/core';
import {NgIf} from '@angular/common';
import {AuthService} from '../../../services/auth.service';
import {ButtonComponent} from '../button/button.component';
import {Router} from '@angular/router';
import {AuthModalService} from '../../../services/shared/auth-modal.service';
import {Subscription} from 'rxjs';
import {NotificationComponent} from '../notification/notification.component';
import { ToastService } from '../../../services/shared/toast.service';
import { NotificationsStore } from '../../../stores/notifications.store';

@Component({
  selector: 'app-hamburger-menu',
  imports: [NgIf, ButtonComponent, NotificationComponent],
  templateUrl: './hamburger-menu.component.html',
  styleUrl: '../../../../styles/styles.css',
})
export class HamburgerMenuComponent implements OnInit, OnDestroy {
  isOpen = false;
  showNotifications = false;
  hasNew = false; // puede vincularse a un servicio de notificaciones real

  // IDs accesibles para aria-controls
  menuId = `menu-${Math.random().toString(36).slice(2, 9)}`;
  notificationsId = `notifications-${Math.random().toString(36).slice(2, 9)}`;

  @ViewChild('toggleButton', { static: false }) toggleButton?: ElementRef<HTMLButtonElement>;
  @ViewChild('notificationsSidebar', { static: false }) notificationsSidebar?: ElementRef<HTMLElement>;

  private authSub?: Subscription;

  constructor(
    private authService: AuthService,
    private el: ElementRef,
    private router: Router,
    private authModalService: AuthModalService,
    private renderer: Renderer2,
    private toastService: ToastService,
    private notificationsStore: NotificationsStore
  ) {}

  toggleMenu() {
    this.isOpen = !this.isOpen;
    // Actualizar aria-expanded usando Renderer2
    if (this.toggleButton && this.toggleButton.nativeElement) {
      this.renderer.setAttribute(this.toggleButton.nativeElement, 'aria-expanded', String(this.isOpen));
      if (this.isOpen) {
        // Si abrimos, enfocar primer enlace del menú
        setTimeout(() => {
          const first = this.el.nativeElement.querySelector('.menu a, .menu button');
          if (first) { (first as HTMLElement).focus(); }
        }, 0);
      } else {
        // al cerrar, devolver foco al botón
        try { this.toggleButton.nativeElement.focus(); } catch (e) {}
      }
    }
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      // abrir: enfocar el panel
      setTimeout(() => {
        const sidebarEl = this.notificationsSidebar?.nativeElement;
        if (sidebarEl) { sidebarEl.focus(); }
      }, 0);
    } else {
      // al cerrar, devolver foco al botón de la campana
      const button = this.el.nativeElement.querySelector('.icon-button');
      try { (button as HTMLElement)?.focus(); } catch (e) {}
    }
  }

  closeNotifications() {
    this.showNotifications = false;
    // devolver foco al botón campana
    const button = this.el.nativeElement.querySelector('.icon-button');
    try { (button as HTMLElement)?.focus(); } catch (e) {}
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    // Comprobación segura: evitar acceso si el elemento no está disponible
    try {
      if (!this.el || !this.el.nativeElement) { return; }
      if (!this.el.nativeElement.contains(event.target)) {
        this.isOpen = false;
        if (this.toggleButton && this.toggleButton.nativeElement) {
          this.renderer.setAttribute(this.toggleButton.nativeElement, 'aria-expanded', 'false');
        }
      }
      // Si la barra lateral está abierta y el click no está dentro de ella, cerrarla
      if (this.showNotifications) {
        const sidebar = this.notificationsSidebar?.nativeElement;
        if (sidebar && !sidebar.contains(event.target as Node)) {
          this.showNotifications = false;
        }
      }
    } catch (e) {
      // en entornos donde el host cambie, prevenir excepción
      this.isOpen = false;
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: Event) {
    const keyboardEvent = event as KeyboardEvent;

    if (keyboardEvent.key === 'Escape') {
      if (this.showNotifications) {
        this.closeNotifications();
        return;
      }
      if (this.isOpen) {
        this.isOpen = false;
        if (this.toggleButton && this.toggleButton.nativeElement) {
          this.renderer.setAttribute(this.toggleButton.nativeElement, 'aria-expanded', 'false');
          try { this.toggleButton.nativeElement.focus(); } catch (e) {}
        }
      }
    }
  }

  loggedIn: boolean = false;


  ngOnInit() {
    this.authSub = this.authService.loggedIn$.subscribe(status => {
      this.loggedIn = status;
      if (!status) {
        // cerrar y limpiar notificaciones cuando el usuario ya no esté logueado
        this.showNotifications = false;
        try { this.toastService.dismissAll(); } catch (e) {}
        try { this.notificationsStore.clear(); } catch (e) {}
      }
    });
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
  }

  openAuthModal(tab: 'login' | 'register' | 'recover' = 'register') {
    if (tab === 'recover') {
      this.router.navigate(['/recuperarContraseña']);
      return;
    }

    this.authModalService.open(tab);
    this.isOpen = false;
  }

  logout() {
    // cerrar UI relacionada con notificaciones
    this.showNotifications = false;

    // limpiar toasts y notificaciones en stores
    try { this.toastService.dismissAll(); } catch (e) { /* ignore */ }
    try { this.notificationsStore.clear(); } catch (e) { /* ignore */ }

    this.authService.removeUserData();
    this.authService.loggedInSubject.next(false);
    this.authService.logout();
    this.router.navigate(['/landing']);
  }
}
