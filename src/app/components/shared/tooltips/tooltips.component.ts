import { Component } from '@angular/core';
import {NgIf} from '@angular/common';

let tooltipIdCounter = 0;

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
  tooltipId = `tooltip-${++tooltipIdCounter}`;

  show() { this.showTooltip = true; }
  hide() { this.showTooltip = false; }
  toggle() { this.showTooltip = !this.showTooltip; }

  onKey(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggle();
    }
  }
}
