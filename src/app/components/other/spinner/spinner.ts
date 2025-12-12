import { Component } from '@angular/core';
import {CommonModule, NgIf} from '@angular/common';
import { LoadingService } from '../../../services/shared/loading.service';

@Component({
  selector: 'app-spinner',
  imports: [
    NgIf,
    CommonModule
  ],
  templateUrl: './spinner.html',
  styleUrl: './spinner.css',
})
export class Spinner {
  loading$;

  constructor(private loading: LoadingService) {
    this.loading$ = this.loading.isLoading$;
  }
}
