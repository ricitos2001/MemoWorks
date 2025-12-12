import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private themeSubject = new BehaviorSubject<'light' | 'dark'>('light');
  currentTheme$ = this.themeSubject.asObservable();

  get currentTheme(): 'light' | 'dark' {
    return this.themeSubject.value;
  }

  constructor() {
    const saved = localStorage.getItem('theme');

    if (saved === 'light' || saved === 'dark') {
      this.themeSubject.next(saved);
    } else {
      const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.themeSubject.next(prefers ? 'dark' : 'light');
    }

    this.applyTheme();
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.themeSubject.next(newTheme);
    localStorage.setItem('theme', newTheme);
    this.applyTheme();
  }

  private applyTheme() {
    document.documentElement.classList.remove('theme-light', 'theme-dark');
    document.documentElement.classList.add(
      this.currentTheme === 'light' ? 'theme-light' : 'theme-dark'
    );
  }
}
