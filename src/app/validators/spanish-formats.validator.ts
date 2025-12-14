// validators/spanish-formats.validator.ts
import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function phoneNumberValidation(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return /^(6|7)[0-9]{8}$/.test(control.value) ? null : { invalidTelefono: true };
  };
}
