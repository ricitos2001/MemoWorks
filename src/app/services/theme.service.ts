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
    // Leer preferencia y persistencia con comprobaciones para SSR
    let saved: string | null;
    try { saved = localStorage.getItem('theme'); } catch (e) { saved = null; }

    if (saved === 'light' || saved === 'dark') {
      this.themeSubject.next(saved as 'light' | 'dark');
    } else if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      const mm = window.matchMedia('(prefers-color-scheme: dark)');
      const prefers = mm.matches;
      this.themeSubject.next(prefers ? 'dark' : 'light');
      // detectar cambios del sistema en tiempo real si el navegador lo soporta
      if (typeof mm.addEventListener === 'function') {
        mm.addEventListener('change', (e: MediaQueryListEvent) => {
          this.themeSubject.next(e.matches ? 'dark' : 'light');
          this.applyTheme();
        });
      } else if (typeof (mm as any).addListener === 'function') {
        // fallback para navegadores antiguos
        (mm as any).addListener((e: MediaQueryListEvent) => {
          this.themeSubject.next(e.matches ? 'dark' : 'light');
          this.applyTheme();
        });
      }
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
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark');
    root.classList.add(this.currentTheme === 'light' ? 'theme-light' : 'theme-dark');
  }
}
