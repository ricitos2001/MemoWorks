import {Component, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import {ThemeService} from '../../services/shared/theme.service';
import {AuthModalComponent} from '../../components/shared/modal/auth-modal.component';
import {ButtonComponent} from '../../components/shared/button/button.component';

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

  constructor(private router: Router, private themeService: ThemeService) {}

  ngOnInit(): void {
       this.themeService.currentTheme$.subscribe(theme => {
      this.darkMode = theme === 'dark';
    });
  }

  openAuthModal(tab: 'login' | 'register' | 'recover' = 'register') {
    if (tab === 'recover') {
      // abrir la página de recuperar contraseña en una ruta separada
      this.router.navigate(['/recuperarContraseña']);
      return;
    }
    this.authModal.open(tab);
  }

  onAuthSuccess() {
    // cerrar modal ya lo hace el AuthModalComponent; aquí navegas
    this.router.navigate(['/dashboard']);
  }
}
