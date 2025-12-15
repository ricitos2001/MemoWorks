import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { pendingChancesGuard } from './pending-chances-guard';

describe('pendingChancesGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => pendingChancesGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
