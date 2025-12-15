import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-add-button',
  imports: [],
  templateUrl: './add-button.component.html',
  styleUrl: '../../../../styles/styles.css',
})
export class AddButtonComponent {
  @Output() add = new EventEmitter<void>();
}
