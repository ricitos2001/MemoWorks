import { Component, Input, Output, EventEmitter } from '@angular/core';
import {NgFor} from '@angular/common';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [NgFor],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css'],
})
export class TabsComponent {
  @Input() tabs: Array<{ key: string; label: string }> = [];
  @Input() active: string = '';
  @Output() activeChange = new EventEmitter<string>();

  selectTab(tab: string) {
    this.active = tab;
    this.activeChange.emit(tab);
  }
}
