import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: '../../../../styles/styles.css',
})
export class Button {
  @Input() disabled: boolean = false;
}
