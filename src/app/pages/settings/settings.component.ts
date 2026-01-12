import {Component} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    RouterOutlet,
    NgFor,
  ],
  templateUrl: './settings.component.html',
  styleUrl: '../../../styles/styles.css',
})
export class SettingsComponent {
  tabs = [
    { key: 'userSettings', label: 'Informacion del Usuario' },
    { key: 'familiarGroups', label: 'Grupo Familiar' },
  ];

  activeTab: string = 'userSettings';
  currentLabel: string = 'Usuario';

  constructor(private router: Router) {
    const url = this.router.url.split('/').pop() || 'userSettings';
    this.setActiveByKey(url);
  }

  onTabChange(key: string) {
    this.setActiveByKey(key);
    this.router.navigate([`/settings/${key}`]);
  }

  private setActiveByKey(key: string) {
    const found = this.tabs.find(t => t.key === key);
    if (found) {
      this.activeTab = found.key;
      this.currentLabel = found.label;
    }
  }

}
