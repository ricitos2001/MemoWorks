// src/app/shared/async-validators.service.ts
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { of, timer} from 'rxjs';
import { switchMap, map, catchError, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AsyncValidatorsService {
  constructor(private http: HttpClient) {}

  emailUnique(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) return of(null);
      return timer(500).pipe(
        switchMap(() => this.http.get<{exists: boolean}>(`http://localhost:8080/api/v1/users/email-exists?email=${control.value}`)),
        map(res => res.exists ? { emailTaken: true } : null),
        catchError(() => of(null)),
        take(1)
      );
    };
  }

  usernameAvailable(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value || control.value.length < 3) return of(null);
      return timer(500).pipe(
        switchMap(() => this.http.get<{exists: boolean}>(`http://localhost:8080/api/v1/users/username-exists?username=${control.value}`)),
        map(res => res.exists ? { usernameTaken: true } : null),
        catchError(() => of(null)),
        take(1)
      );
    };
  }
}
