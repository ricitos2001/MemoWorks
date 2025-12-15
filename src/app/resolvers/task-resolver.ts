import {ResolveFn, Router} from '@angular/router';
import {Task, TaskService} from '../services/task.service';
import { inject } from '@angular/core';
import {catchError, of} from 'rxjs';

export const taskResolver: ResolveFn<Task | null> = (route, state) => {
  const service = inject(TaskService);
  const router = inject(Router);
  const id = route.paramMap.get('id');
  if (!id) return of(null)

  return service.getTask(id).pipe(
    catchError(err => {
      router.navigate(['/dashboard'], {
        state: { error: `No existe el producto con id ${id}` }
      });
      return of(null);
    })
  );
};
