import { Component } from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-tabs',
  imports: [
    NgIf
  ],
  templateUrl: './tabs.html',
  styleUrl: './tabs.css',
})
export class Tabs {
  activeTab = 'detalles';

  selectTab(tab: string) {
    this.activeTab = tab;
  }
}
