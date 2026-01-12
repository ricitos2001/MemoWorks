import { Component, Input } from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-accordion',
  standalone: true,
  templateUrl: './accordion.component.html',
  imports: [
    NgForOf,
    NgIf
  ],
  styleUrl: '../../../../styles/styles.css'
})
export class AccordionComponent {
  @Input() items: Array<{ id: string; title: string; content: string }> = [];
  openIds = new Set<string>();

  toggle(id: string) {
    if (this.openIds.has(id)) this.openIds.delete(id);
    else this.openIds.add(id);
  }

  isOpen(id: string) {
    return this.openIds.has(id);
  }

  onKey(event: KeyboardEvent, index: number) {
    const key = event.key;
    if (key === 'Enter' || key === ' ' || key === 'Spacebar') {
      event.preventDefault();
      const id = this.items[index].id;
      this.toggle(id);
    } else if (key === 'ArrowDown') {
      event.preventDefault();
      const next = (index + 1) % this.items.length;
      const btns = (event.currentTarget as HTMLElement).parentElement?.querySelectorAll('.accordion__header');
      if (btns && btns[next]) (btns[next] as HTMLElement).focus();
    } else if (key === 'ArrowUp') {
      event.preventDefault();
      const prev = (index - 1 + this.items.length) % this.items.length;
      const btns = (event.currentTarget as HTMLElement).parentElement?.querySelectorAll('.accordion__header');
      if (btns && btns[prev]) (btns[prev] as HTMLElement).focus();
    }
  }
}

