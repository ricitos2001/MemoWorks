import { Component } from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-tooltips',
  imports: [
    NgIf
  ],
  templateUrl: './tooltips.component.html',
  styleUrl: '../../../../styles/styles.css',
})
export class TooltipsComponent {
  showTooltip = false;
}
