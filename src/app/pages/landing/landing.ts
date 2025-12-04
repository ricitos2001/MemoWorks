import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {Button} from '../../components/shared/button/button';

@Component({
  selector: 'app-landing',
  imports: [
    Button,
  ],
  templateUrl: './landing.html',
  styleUrl: '../../../styles/styles.css',
})
export class Landing {

  constructor(private router: Router) {}

  getStarted() {
    this.router.navigate(['/register']);
  }
}
