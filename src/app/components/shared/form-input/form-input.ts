import { Component, Input, forwardRef} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-form-input',
  imports: [
    NgIf
  ],
  templateUrl: './form-input.html',
  styleUrl: '../../../../styles/styles.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInput),
      multi: true,
    },
  ],
})

export class FormInput implements ControlValueAccessor {
  @Input() type: string = 'text';
  @Input() name!: string;
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() helpText?: string;
  @Input() errorMessage?: string;
  @Input() showError: boolean = false;

  value: any = '';
  disabled = false;

  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const element = event.target as HTMLInputElement | HTMLTextAreaElement;
    this.onChange(element.value);
  }
}



