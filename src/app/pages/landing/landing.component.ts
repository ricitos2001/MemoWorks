import {Component, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import {ThemeService} from '../../services/shared/theme.service';
import {AuthModalComponent} from '../../components/shared/auth-modal/auth-modal.component';
import {ButtonComponent} from '../../components/shared/button/button.component';
import {AuthModalService} from '../../services/shared/auth-modal.service';
import {distinctUntilChanged} from 'rxjs';

@Component({
  selector: 'app-landing',
  imports: [
    AuthModalComponent,
    ButtonComponent,
  ],
  templateUrl: './landing.component.html',
  styleUrl: '../../../styles/styles.css',
})
export class LandingComponent implements OnInit {
  @ViewChild('authModal') authModal!: AuthModalComponent;
  darkMode = false;

  constructor(private router: Router, private themeService: ThemeService, private authModalService: AuthModalService) {}

  ngOnInit(): void {
    this.themeService.currentTheme$
      .pipe(distinctUntilChanged())
      .subscribe(theme => {
        const newDark = theme === 'dark';
        if (this.darkMode !== newDark) {
          this.darkMode = newDark;
          setTimeout(() => this.refreshPicturesBySelector(), 0);
        }
      });
  }

  openAuthModal(tab: 'login' | 'register' | 'recover' = 'register') {
    if (tab === 'recover') {
      this.router.navigate(['/recuperarContraseña']);
      return;
    }
    this.authModalService.open(tab);
  }

  onAuthSuccess() {
    this.router.navigate(['/dashboard']);
  }

  private refreshPicturesBySelector() {
    const imgs = document.querySelectorAll<HTMLImageElement>('.landing__img');
    imgs.forEach(img => {
      const current = img.getAttribute('src') || img.src;
      img.removeAttribute('src');
      setTimeout(() => img.setAttribute('src', current), 0);
    });
  }
}
