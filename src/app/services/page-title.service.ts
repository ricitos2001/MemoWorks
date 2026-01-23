import { Injectable } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PageTitleService {
  private readonly baseTitle = 'MemoWorks';

  constructor(private router: Router, private title: Title, private activatedRoute: ActivatedRoute) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let route = this.activatedRoute;
        while (route.firstChild) {
          route = route.firstChild;
        }
        const data = route.snapshot.data || {} as Record<string, any>;
        return data['title'] || data['breadcrumb'] || null;
      })
    ).subscribe((pageTitle) => {
      if (pageTitle) {
        this.title.setTitle(`${pageTitle} — ${this.baseTitle}`);
      } else {
        this.title.setTitle(this.baseTitle);
      }
    });
  }
}
