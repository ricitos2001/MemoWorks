import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: '', loadComponent: () => import("./users").then(m => m.Users)}
    ])
  ]
})
export class UsersModule {
}
