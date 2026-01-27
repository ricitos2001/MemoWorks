import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModalComponent} from '../modal/modal.component';
import {ButtonComponent} from '../button/button.component';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent, ButtonComponent, TranslateModule],
  templateUrl: './confirm-modal.component.html',
  styleUrl: '../../../../styles/styles.css',
})
export class ConfirmModalComponent implements OnInit {
  constructor(private translate: TranslateService) {}
  @Output() confirmed = new EventEmitter<void>();
  isOpen = false;
  title = 'Confirmar';
  message = '';

  confirmButton = '';
  cancelButton = '';

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

  private setTranslations() {
    this.confirmButton = this.translate.instant('COMPONENTS.SHARED.CONFIRMMODAL.CONFIRM');
    this.cancelButton = this.translate.instant('COMPONENTS.SHARED.CONFIRMMODAL.CANCEL');
  }

  ngOnInit() {
    this.setTranslations();
    this.translate.onLangChange.subscribe(() => this.setTranslations());
  }
}

