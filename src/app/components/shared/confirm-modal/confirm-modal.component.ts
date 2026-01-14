import {Component, EventEmitter, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModalComponent} from '../modal/modal.component';
import {ButtonComponent} from '../button/button.component';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent, ButtonComponent],
  templateUrl: './confirm-modal.component.html',
  styleUrl: '../../../../styles/styles.css',
})
export class ConfirmModalComponent {
  @Output() confirmed = new EventEmitter<void>();
  isOpen = false;
  title = 'Confirmar';
  message = '';

  open(message: string, title = 'Confirmar') {
    this.message = message;
    this.title = title;
    this.isOpen = true;
  }

  close() { this.isOpen = false; }

  confirm() {
    this.confirmed.emit();
    this.close();
  }
}

