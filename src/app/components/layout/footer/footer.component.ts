import {Component, OnInit} from '@angular/core';
import {ThemeService} from '../../../services/theme.service';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [
    TranslateModule,
    RouterLink
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

  constructor(private themeService: ThemeService, private translate: TranslateService) {}

  ngOnInit(): void {
    this.themeService.currentTheme$.subscribe(theme => {
      this.darkMode = theme === 'dark';
    });

    this.setTranslations();
    this.translate.onLangChange.subscribe(() => this.setTranslations());
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
  }
}
