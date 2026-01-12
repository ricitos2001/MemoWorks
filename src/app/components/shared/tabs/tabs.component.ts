import { Component, Input, Output, EventEmitter } from '@angular/core';
import {NgFor} from '@angular/common';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [NgFor],
  templateUrl: './tabs.component.html',
  styleUrl: '../../../../styles/styles.css',
})
export class TabsComponent {
  @Input() tabs: Array<{ key: string; label: string }> = [];
  @Input() active: string = '';
  @Output() activeChange = new EventEmitter<string>();

  selectTab(tab: string) {
    this.active = tab;
    this.activeChange.emit(tab);
  }

  onKeydown(event: KeyboardEvent, index: number) {
    if (!this.tabs?.length) return;
    const key = event.key;
    let newIndex = index;
    if (key === 'ArrowRight') {
      newIndex = (index + 1) % this.tabs.length;
    } else if (key === 'ArrowLeft') {
      newIndex = (index - 1 + this.tabs.length) % this.tabs.length;
    } else if (key === 'Home') {
      newIndex = 0;
    } else if (key === 'End') {
      newIndex = this.tabs.length - 1;
    } else {
      return;
    }
    event.preventDefault();
    const buttons = (event.currentTarget as HTMLElement).parentElement?.querySelectorAll('button');
    if (buttons && buttons[newIndex]) { (buttons[newIndex] as HTMLElement).focus(); }
    this.selectTab(this.tabs[newIndex].key);
  }
}
