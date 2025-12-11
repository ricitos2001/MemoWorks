import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
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

  @HostListener('document:keydown.escape', ['$event'])
  onEsc() {
    this.close();
  }
}
