import { Component } from '@angular/core';
import {ButtonComponent} from '../button/button.component';

@Component({
  selector: 'app-option-button',
  imports: [
    ButtonComponent
  ],
  templateUrl: './option-button.component.html',
  styleUrl: '../../../../styles/styles.css',
})
export class OptionButtonComponent {
  assetButton: string = 'assets/img/More%20horizontal.svg';

  chanceAsset() {
    this.assetButton = this.assetButton === 'assets/img/More%20horizontal.svg'
      ? 'assets/img/Chevron%20right.svg'
      : 'assets/img/More%20horizontal.svg';
  }
}
