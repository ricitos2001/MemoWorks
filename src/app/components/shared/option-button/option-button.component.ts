import { Component } from '@angular/core';

@Component({
  selector: 'app-option-button',
  imports: [],
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
