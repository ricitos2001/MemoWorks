import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ThemeService} from '../../../services/shared/theme.service';

@Component({
  selector: 'app-footer',
  imports: [
  ],
  templateUrl: './footer.html',
  styleUrl: '../../../../styles/styles.css',
})
export class Footer implements OnInit {
  darkMode = false;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.currentTheme$.subscribe(theme => {
      this.darkMode = theme === 'dark';
    });
  }
}
