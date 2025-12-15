import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserSettingsComponent } from './user-settings.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: '', component: UserSettingsComponent} // ruta base del módulo
    ]),
    UserSettingsComponent
  ]
})
export class UserSettingsModule {}
