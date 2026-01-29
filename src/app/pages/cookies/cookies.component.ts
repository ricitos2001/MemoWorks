import {Component, OnInit} from '@angular/core';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-cookies',
  imports: [
    TranslateModule
  ],
  templateUrl: './cookies.component.html',
  styleUrl: '../../../styles/styles.css',
  standalone: true,
})
export class CookiesComponent implements OnInit {
  constructor(private translate: TranslateService) {}
  title: string = '';
  warning: string = '';
  date: string = '';
  subtitle1: string = '';
  text1: string = '';
  subtitle2: string = ''
  cookie1: string = '';
  cookietDescription1: string = '';
  cookie2: string = ''
  cookietDescription2: string = '';
  cookie3: string = ''
  cookietDescription3: string = '';
  cookie4: string = ''
  cookietDescription4: string = '';
  subtitle3: string = ''
  text3: string = '';
  subtitle4: string = ''
  text4: string = '';
  aboutDudes: string = ''
  ngOnInit() {
    this.setTranslations();
    this.translate.onLangChange.subscribe(() => this.setTranslations());
  }

  private setTranslations() {
    this.title = this.translate.instant('PAGES.COOKIES.TITLE');
    this.warning = this.translate.instant('PAGES.COOKIES.WARNING');
    this.date = this.translate.instant('PAGES.COOKIES.DATE');
    this.subtitle1 = this.translate.instant('PAGES.COOKIES.SUBTITLE1');
    this.text1 = this.translate.instant('PAGES.COOKIES.TEXT1');
    this.subtitle2 = this.translate.instant('PAGES.COOKIES.SUBTITLE2');
    this.cookie1 = this.translate.instant('PAGES.COOKIES.COOKIE1');
    this.cookietDescription1 = this.translate.instant('PAGES.COOKIES.COOKIEDESCRIPTION1');
    this.cookie2 = this.translate.instant('PAGES.COOKIES.COOKIE2');
    this.cookietDescription2 = this.translate.instant('PAGES.COOKIES.COOKIEDESCRIPTION2');
    this.cookie3 = this.translate.instant('PAGES.COOKIES.COOKIE3');
    this.cookietDescription3 = this.translate.instant('PAGES.COOKIES.COOKIEDESCRIPTION3');
    this.cookie4 = this.translate.instant('PAGES.COOKIES.COOKIE4');
    this.cookietDescription4 = this.translate.instant('PAGES.COOKIES.COOKIEDESCRIPTION4');
    this.subtitle3 = this.translate.instant('PAGES.COOKIES.SUBTITLE3');
    this.text3 = this.translate.instant('PAGES.COOKIES.TEXT3');
    this.subtitle4 = this.translate.instant('PAGES.COOKIES.SUBTITLE4');
    this.text4 = this.translate.instant('PAGES.COOKIES.TEXT4');
    this.aboutDudes = this.translate.instant('PAGES.COOKIES.ABOUTDUDES');
  }
}
