import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {DarkModeButtonComponent} from '../dark-mode-button/dark-mode-button.component';
import {NgIf} from '@angular/common';
import {AuthService} from '../../../services/auth.service';
import {ButtonComponent} from '../button/button.component';
import {AuthModalComponent} from '../auth-modal/auth-modal.component';
import {Router} from '@angular/router';
import {ThemeService} from '../../../services/shared/theme.service';
import {AuthModalService} from '../../../services/shared/auth-modal.service';

@Component({
  selector: 'app-hamburger-menu',
  imports: [NgIf, ButtonComponent],
  templateUrl: './hamburger-menu.component.html',
  styleUrl: '../../../../styles/styles.css',
})
export class HamburgerMenuComponent implements OnInit {
  isOpen = false;

  constructor(
    private authService: AuthService,
    private el: ElementRef,
    private router: Router,
    private authModalService: AuthModalService
  ) {}

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  loggedIn: boolean = false;


  ngOnInit() {
    this.authService.loggedIn$.subscribe(status => {
      this.loggedIn = status;
    });
  }

  @ViewChild('authModal') authModal!: AuthModalComponent;

  openAuthModal(tab: 'login' | 'register' | 'recover' = 'register') {
    if (tab === 'recover') {
      this.router.navigate(['/recuperarContraseña']);
      return;
    }

    this.authModalService.open(tab);
    this.isOpen = false;
  }

  logout() {
    this.authService.removeUserData();
    this.authService.loggedInSubject.next(false);
    this.authService.logout();
    this.router.navigate(['/landing']);
  }
}
