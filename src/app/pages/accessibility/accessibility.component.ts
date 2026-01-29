import {Component, OnInit} from '@angular/core';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-accessibility',
  imports: [
    TranslateModule
  ],
  templateUrl: './accessibility.component.html',
  styleUrl: '../../../styles/styles.css',
  standalone: true,
})
export class AccessibilityComponent implements OnInit{
  constructor(private translate: TranslateService) {
  }
  comingsoon: string = '';

  ngOnInit() {
    this.setTranslations();
    this.translate.onLangChange.subscribe(() => this.setTranslations());
  }

  private setTranslations() {
    this.comingsoon = this.translate.instant('PAGES.SETTINGS.ACCESSIBILITYSETTINGS.COMINGSOON');
  }
}
