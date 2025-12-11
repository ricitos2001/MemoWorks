import {Component, OnInit, Renderer2} from '@angular/core';
import {Button} from '../../shared/button/button';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-dark-mode-button',
  imports: [
    NgIf
  ],
  templateUrl: './dark-mode-button.html',
  //styleUrl: '../../../../styles/styles.css',
  styleUrl: 'dark-mode-button.css'
})
export class DarkModeButton implements OnInit {
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
