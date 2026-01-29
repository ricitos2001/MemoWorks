import {Component, OnInit} from '@angular/core';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-terms',
  imports: [
    TranslateModule
  ],
  templateUrl: './terms.component.html',
  styleUrl: '../../../styles/styles.css',
  standalone: true,
})
export class TermsComponent implements OnInit{
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
    this.title = this.translate.instant('PAGES.TERMS.TITLE');
    this.warning = this.translate.instant('PAGES.TERMS.WARNING');
    this.date = this.translate.instant('PAGES.TERMS.DATE');
    this.subtitle1 = this.translate.instant('PAGES.TERMS.SUBTITLE1');
    this.text1 = this.translate.instant('PAGES.TERMS.TEXT1');
    this.subtitle2 = this.translate.instant('PAGES.TERMS.SUBTITLE2');
    this.text2 = this.translate.instant('PAGES.TERMS.TEXT2');
    this.subtitle3 = this.translate.instant('PAGES.TERMS.SUBTITLE3');
    this.text3 = this.translate.instant('PAGES.TERMS.TEXT3');
    this.subtitle4 = this.translate.instant('PAGES.TERMS.SUBTITLE4');
    this.text4 = this.translate.instant('PAGES.TERMS.TEXT4');
    this.subtitle5 = this.translate.instant('PAGES.TERMS.SUBTITLE5');
    this.text5 = this.translate.instant('PAGES.TERMS.TEXT5');
    this.subtitle6 = this.translate.instant('PAGES.TERMS.SUBTITLE6');
    this.text6 = this.translate.instant('PAGES.TERMS.TEXT6');
    this.subtitle7 = this.translate.instant('PAGES.TERMS.SUBTITLE7');
    this.text7 = this.translate.instant('PAGES.TERMS.TEXT7');
    this.aboutDudes = this.translate.instant('PAGES.TERMS.ABOUTDUDES');
  }
}
