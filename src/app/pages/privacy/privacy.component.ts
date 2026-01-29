import {Component, OnInit} from '@angular/core';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-privacy',
  imports: [
    TranslateModule
  ],
  templateUrl: './privacy.component.html',
  styleUrl: '../../../styles/styles.css',
  standalone: true,
})
export class PrivacyComponent implements OnInit {
  constructor(private translate: TranslateService) {}
  title: string = '';
  warning: string = '';
  date: string = '';
  subtitle1: string = '';
  text1: string = '';
  subtitle2: string = ''
  text2: string = '';
  subtitle3: string = ''
  text3: string = '';
  subtitle4: string = ''
  text4: string = '';
  subtitle5: string = ''
  text5: string = '';
  subtitle6: string = ''
  text6: string = '';
  subtitle7: string = ''
  text7: string = ''
  aboutDudes: string = ''
  ngOnInit() {
    this.setTranslations();
    this.translate.onLangChange.subscribe(() => this.setTranslations());
  }

  private setTranslations() {
    this.title = this.translate.instant('PAGES.PRIVACY.TITLE');
    this.warning = this.translate.instant('PAGES.PRIVACY.WARNING');
    this.date = this.translate.instant('PAGES.PRIVACY.DATE');
    this.subtitle1 = this.translate.instant('PAGES.PRIVACY.SUBTITLE1');
    this.text1 = this.translate.instant('PAGES.PRIVACY.TEXT1');
    this.subtitle2 = this.translate.instant('PAGES.PRIVACY.SUBTITLE2');
    this.text2 = this.translate.instant('PAGES.PRIVACY.TEXT2');
    this.subtitle3 = this.translate.instant('PAGES.PRIVACY.SUBTITLE3');
    this.text3 = this.translate.instant('PAGES.PRIVACY.TEXT3');
    this.subtitle4 = this.translate.instant('PAGES.PRIVACY.SUBTITLE4');
    this.text4 = this.translate.instant('PAGES.PRIVACY.TEXT4');
    this.subtitle5 = this.translate.instant('PAGES.PRIVACY.SUBTITLE5');
    this.text5 = this.translate.instant('PAGES.PRIVACY.TEXT5');
    this.subtitle6 = this.translate.instant('PAGES.PRIVACY.SUBTITLE6');
    this.text6 = this.translate.instant('PAGES.PRIVACY.TEXT6');
    this.subtitle7 = this.translate.instant('PAGES.PRIVACY.SUBTITLE7');
    this.text7 = this.translate.instant('PAGES.PRIVACY.TEXT7');
    this.aboutDudes = this.translate.instant('PAGES.PRIVACY.ABOUTDUDES');
  }
}
