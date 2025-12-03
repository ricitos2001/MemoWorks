import { Component, Input } from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-form-input',
  imports: [
    NgIf
  ],
  templateUrl: './form-input.html',
  styleUrl: '../../../../styles/styles.css',

})
export class FormInput {
  @Input() type: string = 'text';
  @Input() name!: string;
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() helpText?: string;
  @Input() errorMessage?: string;
  @Input() showError: boolean = false;
}



