import { Component, EventEmitter, Input, Output, HostListener, AfterViewInit, OnDestroy, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: '../../../../styles/styles.css'
})
export class ModalComponent implements AfterViewInit, OnDestroy {
  private _isOpen = false;
  @Input()
  set isOpen(value: boolean) {
    const prev = this._isOpen;
    this._isOpen = value;
    if (value && !prev) {
      this.onOpen();
    } else if (!value && prev) {
      this.onClose();
    }
  }
  get isOpen() { return this._isOpen; }
  @Input() title = '';
  @Input() showHeader = false;
  @Input() disableClose = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Output() close = new EventEmitter<void>();

  @ViewChild('container', { static: false }) container?: ElementRef<HTMLElement>;

  private previouslyFocused?: HTMLElement | null = null;
  private unlistenKeydown: (() => void) | null = null;

  onOverlayClick() {
    if (this.disableClose) return;
    this.close.emit();
  }

  onCloseClick() {
    if (this.disableClose) return;
    this.close.emit();
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: Event) {
    const keyboardEvent = event as KeyboardEvent;

    if (this.disableClose) return;
    if (this.isOpen && keyboardEvent.key === 'Escape') {
      this.close.emit();
    }
  }

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    // Si el modal ya estaba abierto al montar, asegurar estado correcto
    if (this.isOpen) {
      this.onOpen();
    }
  }

  private onOpen() {
    // Guardar foco previo
    this.previouslyFocused = document.activeElement as HTMLElement;
    // Bloquear scroll del body
    try {
      this.renderer.setStyle(document.body, 'overflow', 'hidden');
    } catch (e) {
      // En entornos donde document no existe, ignorar
    }

    // Esperar a que container exista y enfocar el primer elemento focusable
    setTimeout(() => {
      const el = this.container?.nativeElement;
      if (!el) return;
      const focusable = el.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      (focusable[0] || el).focus();

      // Trap de Tab dentro del modal
      this.unlistenKeydown = this.renderer.listen(el, 'keydown', (evt: KeyboardEvent) => {
        if (evt.key !== 'Tab') return;
        const nodes = Array.from(el.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
          .filter(n => !n.hasAttribute('disabled'));
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (!evt.shiftKey && document.activeElement === last) {
          evt.preventDefault();
          first.focus();
        }
        if (evt.shiftKey && document.activeElement === first) {
          evt.preventDefault();
          last.focus();
        }
      });
    }, 0);
  }

  private onClose() {
    // Restaurar scroll
    try {
      this.renderer.removeStyle(document.body, 'overflow');
    } catch (e) {
      // ignore
    }
    // Restaurar focus
    try {
      this.previouslyFocused?.focus();
    } catch (e) {}

    // Limpiar listener de keydown
    if (this.unlistenKeydown) {
      this.unlistenKeydown();
      this.unlistenKeydown = null;
    }
  }

  ngOnDestroy(): void {
    // Asegurar limpieza
    if (this.unlistenKeydown) {
      this.unlistenKeydown();
      this.unlistenKeydown = null;
    }
    try { this.renderer.removeStyle(document.body, 'overflow'); } catch (e) {}
  }

}
