import { Component, HostListener } from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-modal',
  imports: [
    NgIf
  ],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
  isOpen = false;

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.close();
    }
  }

}
