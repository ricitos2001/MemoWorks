import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: '../../../../styles/styles.css'
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() showHeader = false;
  @Input() disableClose = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Output() close = new EventEmitter<void>();

  onOverlayClick() {
    if (this.disableClose) return;
    this.close.emit();
  }

  onCloseClick() {
    if (this.disableClose) return;
    this.close.emit();
  }
}
