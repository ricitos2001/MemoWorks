import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-add-button',
  imports: [],
  templateUrl: './add-button.html',
  styleUrl: '../../../../styles/styles.css',
})
export class AddButton {
  @Output() add = new EventEmitter<void>();
}
