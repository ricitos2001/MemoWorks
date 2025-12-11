import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import {NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {DarkModeButton} from '../../other/dark-mode-button/dark-mode-button';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  imports: [
    NgIf,
    DarkModeButton,
  ],
  styleUrl: '../../../../styles/styles.css',
})
export class Header implements OnInit, AfterViewInit {

  constructor(private authService: AuthService, private renderer: Renderer2) {}
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
      this.darkMode = false;
    }
  }

  loggedIn: boolean = false;


  ngOnInit() {
    this.authService.loggedIn$.subscribe(status => {
      this.loggedIn = status;
    });
  }
}
