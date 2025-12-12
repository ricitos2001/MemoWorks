import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {DarkModeButton} from '../../other/dark-mode-button/dark-mode-button';
import {HamburgerMenu} from '../../other/hamburger-menu/hamburger-menu';
import {ThemeService} from '../../../services/shared/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  imports: [
    DarkModeButton,
    HamburgerMenu,
  ],
  styleUrl: '../../../../styles/styles.css',
})
export class Header implements AfterViewInit, OnInit {

  constructor(private renderer: Renderer2, public themeService: ThemeService) {}

  darkMode = false;

  @ViewChild('header', { static: false }) header!: ElementRef;

  ngAfterViewInit() {
    console.log(this.header.nativeElement);
  }

  changeTheme() {
    if(!this.darkMode) {
      this.renderer.setStyle(this.header.nativeElement, 'background', '#292929');
      this.darkMode = true;
    } else {
      this.renderer.setStyle(this.header.nativeElement, 'background', '#4E2754');
    }
  }

  toggle() {
    this.themeService.toggleTheme();
  }

  ngOnInit(): void {
    this.themeService.currentTheme$.subscribe(theme => {
      this.darkMode = theme === 'dark';
    });
  }
}
