import {Component, OnInit, Renderer2} from '@angular/core';
import {ButtonComponent} from '../../shared/button/button.component';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-dark-mode-button',
  imports: [
    NgIf
  ],
  templateUrl: './dark-mode-button.component.html',
  //styleUrl: '../../../../styles/styles.css',
  styleUrl: 'dark-mode-button.component.css'
})
export class DarkModeButtonComponent implements OnInit {
  isDarkMode = false;

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
    this.applyTheme();
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme(): void {
    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'dark-theme');
    } else {
      this.renderer.removeClass(document.body, 'dark-theme');
    }
  }
}
