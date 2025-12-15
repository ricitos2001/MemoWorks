import { Component } from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-tooltips',
  imports: [
    NgIf
  ],
  templateUrl: './tooltips.component.html',
  styleUrl: './tooltips.component.css',
})
export class TooltipsComponent {
  showTooltip = false;
}
