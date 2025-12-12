import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import {Button} from '../../components/shared/button/button';
import {NgIf} from '@angular/common';
import {ThemeService} from '../../services/shared/theme.service';

@Component({
  selector: 'app-landing',
  imports: [
    Button,
  ],
  templateUrl: './landing.html',
  styleUrl: '../../../styles/styles.css',
})
export class Landing implements OnInit {
  darkMode = false;

  constructor(private router: Router, private themeService: ThemeService) {}

  ngOnInit(): void {
       this.themeService.currentTheme$.subscribe(theme => {
      this.darkMode = theme === 'dark';
    });
  }

  getStarted() {
    this.router.navigate(['/register']);
  }
}
