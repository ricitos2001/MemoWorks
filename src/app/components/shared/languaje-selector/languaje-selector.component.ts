import {Component, OnInit} from '@angular/core';
import {LanguageService} from '../../../services/language.service';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-languaje-selector',
  imports: [
    NgForOf
  ],
  templateUrl: './languaje-selector.component.html',
  styleUrl: '../../../../styles/styles.css',
})
export class LanguajeSelectorComponent implements OnInit {

  constructor(private languageService: LanguageService) {
  }

  languages = [
    { code: 'es', label: 'Español'},
    { code: 'en', label: 'English'}
  ];

  currentLang = 'es';

  ngOnInit(): void {
    this.currentLang = this.languageService.getCurrentLanguage();
    this.languageService.languageChanges$.subscribe(lang => {
      if (lang) {
        this.currentLang = lang;
      }
    });
  }

  setLanguage(lang: string) {
    if (!lang) {
      return;
    }
    this.languageService.setLanguage(lang);
    this.currentLang = lang;
  }
}
