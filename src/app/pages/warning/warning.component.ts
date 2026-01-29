import {Component, OnInit} from '@angular/core';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-warning',
  imports: [
    TranslateModule
  ],
  templateUrl: './warning.component.html',
  styleUrl: '../../../styles/styles.css',
  standalone: true,
})
export class WarningComponent implements OnInit {
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
  aboutDudes: string = ''
  ngOnInit() {
    this.setTranslations();
    this.translate.onLangChange.subscribe(() => this.setTranslations());
  }

  private setTranslations() {
    this.title = this.translate.instant('PAGES.WARNING.TITLE');
    this.warning = this.translate.instant('PAGES.WARNING.WARNING');
    this.date = this.translate.instant('PAGES.WARNING.DATE');
    this.subtitle1 = this.translate.instant('PAGES.WARNING.SUBTITLE1');
    this.text1 = this.translate.instant('PAGES.WARNING.TEXT1');
    this.subtitle2 = this.translate.instant('PAGES.WARNING.SUBTITLE2');
    this.text2 = this.translate.instant('PAGES.WARNING.TEXT2');
    this.subtitle3 = this.translate.instant('PAGES.WARNING.SUBTITLE3');
    this.text3 = this.translate.instant('PAGES.WARNING.TEXT3');
    this.subtitle4 = this.translate.instant('PAGES.WARNING.SUBTITLE4');
    this.text4 = this.translate.instant('PAGES.WARNING.TEXT4');
    this.subtitle5 = this.translate.instant('PAGES.WARNING.SUBTITLE5');
    this.text5 = this.translate.instant('PAGES.WARNING.TEXT5');
    this.subtitle6 = this.translate.instant('PAGES.WARNING.SUBTITLE6');
    this.text6 = this.translate.instant('PAGES.WARNING.TEXT6');
    this.aboutDudes = this.translate.instant('PAGES.WARNING.ABOUTDUDES');
  }
}
