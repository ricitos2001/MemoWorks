import {Component, OnInit} from '@angular/core';
import {ThemeService} from '../../../services/shared/theme.service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [
    RouterLink
  ],
  templateUrl: './footer.component.html',
  styleUrl: '../../../../styles/styles.css',
})
export class FooterComponent implements OnInit {
  darkMode = false;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.currentTheme$.subscribe(theme => {
      this.darkMode = theme === 'dark';
    });
  }
}
