import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Output() close = new EventEmitter<void>();

  onOverlayClick() {
    this.close.emit();
  }

  onCloseClick() {
    this.close.emit();
  }
}

