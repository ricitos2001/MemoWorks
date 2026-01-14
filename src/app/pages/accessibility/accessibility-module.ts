import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {AccessibilityComponent} from './accessibility.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: '', component: AccessibilityComponent}
    ]),
    AccessibilityComponent
  ]
})
export class AccessibilityModule {}
