// breadcrumb.ts
import { Component, OnInit } from '@angular/core';
import { BreadcrumbService, Breadcrumb } from '../../../services/breadcrumb.service';
import {RouterLink} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  imports: [
    RouterLink,
    NgIf,
    NgForOf,
    TranslateModule
  ],
  styleUrl: '../../../../styles/styles.css'
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [];

  constructor(private breadcrumbService: BreadcrumbService, private translate: TranslateService) {}

  breadcrumb = ''

  ngOnInit() {
    this.breadcrumbService.breadcrumbs$.subscribe(crumbs => this.breadcrumbs = crumbs);
    this.setTranslations();
    this.translate.onLangChange.subscribe(() => this.setTranslations());
  }

  private setTranslations() {
    this.breadcrumb = this.translate.instant('COMPONENTS.SHARED.BREADCRUMB.HOME');
  }
}
