import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import {NgFor} from '@angular/common';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [NgFor],
  templateUrl: './tabs.component.html',
  styleUrl: '../../../../styles/styles.css',
})
export class TabsComponent implements AfterViewInit {
  @Input() tabs: Array<{ key: string; label: string }> = [];
  @Input() active: string = '';
  @Output() activeChange = new EventEmitter<string>();

  selectTab(tab: string) {
    this.active = tab;
    this.activeChange.emit(tab);
  }

  ngAfterViewInit(): void {
    // Si no hay active explícito, seleccionar la primera pestaña
    if (!this.active && this.tabs?.length) {
      this.selectTab(this.tabs[0].key);
    }
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

  // Helper para templates: generar id de tab y panel
  tabId(key: string) { return `tab-${key}`; }
  panelId(key: string) { return `panel-${key}`; }
}
