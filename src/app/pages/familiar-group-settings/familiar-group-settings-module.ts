import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FamiliarGroupSettingsComponent } from './familiar-group-settings.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: '', component: FamiliarGroupSettingsComponent}
    ]),
    FamiliarGroupSettingsComponent
  ]
})
export class FamiliarGroupSettingsModule {}
