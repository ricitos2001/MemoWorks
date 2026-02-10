import {Component, OnInit} from '@angular/core';
import {ThemeService} from '../../../services/shared/theme.service';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import {AuthService} from '../../../services/auth.service';
import {ToastService} from '../../../services/shared/toast.service';
import {NotificationsStore} from '../../../stores/notifications.store';
import {NgIf} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [
    TranslateModule,
    NgIf
  ],
  templateUrl: './footer.component.html',
  styleUrl: '../../../../styles/styles.css',
})
export class FooterComponent implements OnInit {
  darkMode = false;
  legalInformation = ''
  help = ''
  contact = ''
  terms = ''
  styles = ''
  warning = ''
  privacy = ''
  cookies = ''
  userList = ''
  loggedIn: boolean = false;
  showNotifications = false;
  private authSub?: Subscription;

  constructor(private themeService: ThemeService, private translate: TranslateService, private authService: AuthService, private toastService: ToastService, private notificationsStore: NotificationsStore, private router: Router,) {
  }

  ngOnInit(): void {
    this.authSub = this.authService.loggedIn$.subscribe(status => {
      this.loggedIn = status;
      if (!status) {
        this.showNotifications = false;
        try {
          this.toastService.dismissAll();
        } catch (e) {
        }
        try {
          this.notificationsStore.clear();
        } catch (e) {
        }
      }
    });
    this.themeService.currentTheme$.subscribe(theme => {
      this.darkMode = theme === 'dark';
    });

    this.setTranslations();
    this.translate.onLangChange.subscribe(() => this.setTranslations());
  }

  goToSite() {
    this.router.navigate(['/users/userList'])
  }

  private setTranslations() {
    this.legalInformation = this.translate.instant('COMPONENTS.LAYOUT.FOOTER.LEGALINFORMATION');
    this.help = this.translate.instant('COMPONENTS.LAYOUT.FOOTER.HELP');
    this.contact = this.translate.instant('COMPONENTS.LAYOUT.FOOTER.CONTACT');
    this.terms = this.translate.instant('COMPONENTS.LAYOUT.FOOTER.TERMS');
    this.styles = this.translate.instant('COMPONENTS.LAYOUT.FOOTER.STYLES');
    this.warning = this.translate.instant('COMPONENTS.LAYOUT.FOOTER.WARNING');
    this.privacy = this.translate.instant('COMPONENTS.LAYOUT.FOOTER.PRIVACY');
    this.cookies = this.translate.instant('COMPONENTS.LAYOUT.FOOTER.COOKIES');
    this.userList = this.translate.instant('COMPONENTS.LAYOUT.FOOTER.USERLIST');
  }
}
