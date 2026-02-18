import {Component} from '@angular/core';
import {CommonModule, NgIf} from '@angular/common';
import {LoadingService} from '../../../services/loading.service';

@Component({
  selector: 'app-spinner',
  imports: [
    NgIf,
    CommonModule
  ],
  templateUrl: './spinner.component.html',
  styleUrl: '../../../../styles/styles.css',
})
export class SpinnerComponent {
  loading$;

  constructor(private loading: LoadingService) {
    this.loading$ = this.loading.isLoading$;
  }
}
