import {Component, DestroyRef, inject} from '@angular/core';
import {Router, RouterOutlet, NavigationEnd} from '@angular/router';
import { NgFor } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    RouterOutlet,
    NgFor,
    TranslateModule
  ],
  templateUrl: './settings.component.html',
  styleUrl: '../../../styles/styles.css',
})
export class SettingsComponent {
  tabs: { key: string; route: string }[] = [
    { key: 'USER', route: 'userSettings' },
    { key: 'FAMILIAR_GROUPS', route: 'familiarGroups' },
    { key: 'ACCESSIBILITY', route: 'accessibility' },
  ];

  // activeTab holds the route (e.g. 'userSettings')
  activeTab: string = 'userSettings';

  private destroyRef = inject(DestroyRef);

  constructor(private router: Router) {
    const url = this.router.url.split('/').pop() || 'userSettings';
    this.setActiveByKey(url);

    // update when navigation ends (user uses back/forward or navigates directly)
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const u = this.router.url.split('/').pop() || 'userSettings';
        this.setActiveByKey(u);
      });
  }

  onTabChange(route: string) {
    this.setActiveByKey(route);
    this.router.navigate([`/settings/${route}`]);
  }

  // Use route matching (not key) so camelCase routes match correctly
  private setActiveByKey(route: string) {
    const found = this.tabs.find(t => t.route === route);
    if (found) {
      this.activeTab = found.route;
    }
  }

  // Getter that returns the translation key for the current active tab
  get activeKey(): string {
    const found = this.tabs.find(t => t.route === this.activeTab);
    return found ? found.key : 'USER';
  }

}
