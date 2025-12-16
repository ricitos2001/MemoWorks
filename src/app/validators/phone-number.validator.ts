import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function phoneNumberValidation(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const cleanedValue = control.value.replace(/[\s\-()]/g, '');
    const regex = /^\+?\d{6,15}$/;
    return regex.test(cleanedValue) ? null : { invalidPhoneNumber: true };
  };
}
