import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AllMembersComponent } from './all-members.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: '', component: AllMembersComponent}
    ]),
    AllMembersComponent
  ]
})
export class AllMembersModule {}
