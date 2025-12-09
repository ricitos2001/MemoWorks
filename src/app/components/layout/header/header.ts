import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import {NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  imports: [
    NgIf,
  ],
  styleUrl: '../../../../styles/styles.css',
})
export class Header implements OnInit {
  loggedIn: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.loggedIn$.subscribe(status => {
      this.loggedIn = status;
    });
  }
}
