import { Component } from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-tooltips',
  imports: [
    NgIf
  ],
  templateUrl: './tooltips.html',
  styleUrl: './tooltips.css',
})
export class Tooltips {
  showTooltip = false;
}
