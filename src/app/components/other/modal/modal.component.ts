import { Component, HostListener } from '@angular/core';
import {NgIf} from '@angular/common';
import {ButtonComponent} from '../../shared/button/button.component';

@Component({
  selector: 'app-modal',
  imports: [
    NgIf,
    ButtonComponent
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
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
