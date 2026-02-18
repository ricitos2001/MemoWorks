import {Component, OnInit} from '@angular/core';
import {ThemeService} from '../../../services/theme.service';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-back-button',
  imports: [
    TranslateModule,
    RouterLink
  ],
  templateUrl: './back-button.html',
  styleUrl: '../../../../styles/styles.css',
})
export class BackButton implements OnInit {
  darkMode = false;
  backButton = ''

  constructor(private themeService: ThemeService, private translate: TranslateService) {}

  ngOnInit(): void {
    this.themeService.currentTheme$.subscribe(theme => {
      this.darkMode = theme === 'dark';
    });

    this.setTranslations();
    this.translate.onLangChange.subscribe(() => this.setTranslations());
  }

  private setTranslations() {
    this.backButton = this.translate.instant('COMPONENTS.SHARED.BACKBUTTON');
  }
}
