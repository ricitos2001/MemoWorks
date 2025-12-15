import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: '../../../../styles/styles.css',
})
export class ButtonComponent {
  @Input() disabled: boolean = false;
}
