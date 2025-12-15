import {Component, ElementRef, HostListener, OnInit} from '@angular/core';
import {DarkModeButtonComponent} from '../dark-mode-button/dark-mode-button.component';
import {NgIf} from '@angular/common';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-hamburger-menu',
  imports: [
    NgIf
  ],
  templateUrl: './hamburger-menu.component.html',
  styleUrl: '../../../../styles/styles.css',
})
export class HamburgerMenuComponent implements OnInit {
  isOpen = false;

  constructor(private authService: AuthService, private el: ElementRef) {}

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  loggedIn: boolean = false;


  ngOnInit() {
    this.authService.loggedIn$.subscribe(status => {
      this.loggedIn = status;
    });
  }
}
