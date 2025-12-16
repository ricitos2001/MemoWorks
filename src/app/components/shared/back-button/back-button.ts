import {Component, OnInit} from '@angular/core';
import {ThemeService} from '../../../services/shared/theme.service';

@Component({
  selector: 'app-back-button',
  imports: [],
  templateUrl: './back-button.html',
  styleUrl: '../../../../styles/styles.css',
})
export class BackButton implements OnInit {
  darkMode = false;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.currentTheme$.subscribe(theme => {
      this.darkMode = theme === 'dark';
    });
  }
}
