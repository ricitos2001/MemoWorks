// pending-changes.guard.ts
import { FormGroup } from '@angular/forms';
import { CanDeactivateFn } from '@angular/router';

export interface FormComponent {
  form: FormGroup;
}

export function hasPendingChanges(component: FormComponent): boolean {
  if (component.form?.dirty) {
    return confirm('Hay cambios sin guardar. ¿Seguro que quieres salir?');
  }
  return true;
}

export const pendingChangesGuard: CanDeactivateFn<FormComponent> =
  (component) => hasPendingChanges(component);
