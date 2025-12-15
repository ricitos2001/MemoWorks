// breadcrumb.component.ts
import { Component, OnInit } from '@angular/core';
import { BreadcrumbService, Breadcrumb } from '../../../services/breadcrumb.service';
import {RouterLink} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  imports: [
    RouterLink,
    NgIf,
    NgForOf
  ],
  styleUrl: './breadcrumb.component.css'
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [];

  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit() {
    this.breadcrumbService.breadcrumbs$.subscribe(crumbs => this.breadcrumbs = crumbs);
  }
}
