import {Injectable} from '@angular/core';
import {CanDeactivate} from '@angular/router';
import {PageTransitionService} from '../services/page-transition.service';

@Injectable({ providedIn: 'root' })
export class PageTransitionGuard implements CanDeactivate<unknown> {
  constructor(private transition: PageTransitionService) {}

  canDeactivate(): Promise<boolean> {
    // playExit returns a Promise<void>, convert to boolean
    return this.transition.playExit().then(() => true).catch(() => true);
  }
}

