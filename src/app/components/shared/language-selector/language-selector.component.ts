import {Component, OnInit} from '@angular/core';
import {LanguageService} from '../../../services/language.service';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-language-selector',
  imports: [
    NgForOf
  ],
  templateUrl: './language-selector.component.html',
  styleUrl: '../../../../styles/styles.css',
})
export class LanguageSelectorComponent implements OnInit {

  constructor(private languageService: LanguageService) {
  }

  languages = [
    { code: 'es', label: 'Español'},
    { code: 'en', label: 'English'}
  ];

  currentLang!: string;

  ngOnInit(): void {
    this.currentLang = this.languageService.getCurrentLanguage();
    this.languageService.languageChanges$.subscribe(lang => {
      if (lang) {
        this.currentLang = lang;
      }
    });
  }

  setLanguage(lang: string) {
    this.languageService.setLanguage(lang);
    this.currentLang = lang;
  }
}
