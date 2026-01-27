import {Component, OnInit} from '@angular/core';
import {ThemeService} from '../../../services/shared/theme.service';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-back-button',
  imports: [
    TranslateModule
  ],
  templateUrl: './back-button.html',
  styleUrl: '../../../../styles/styles.css',
})
export class BackButton implements OnInit {
  darkMode = false;

  constructor(private themeService: ThemeService, private translate: TranslateService) {}
  backButton = ''

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
