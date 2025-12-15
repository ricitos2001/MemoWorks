import { Routes } from '@angular/router';
import {LandingComponent} from './pages/landing/landing.component';
import {LoginComponent} from './pages/login/login.component';
import {RegisterComponent} from './pages/register/register.component';
import {DasboardComponent} from './pages/dasboard/dasboard.component';
import {Calendarcomponent} from './pages/calendar/calendarcomponent';
import {RecoverPasswordComponent} from './pages/recover-password/recover-password.component';
import {NotFoundComponentComponent} from './pages/notfoundcomponent/not-found-component.component';
import {TaskCardComponent} from './components/shared/task-card/task-card.component';
import {authGuard} from './guards/auth-guard';
import {taskResolver} from './resolvers/task-resolver';
import {EditUserInfoComponent} from './pages/edit-user-info/edit-user-info.component';
import {SelectTaskForEditComponent} from './pages/select-task-for-edit/select-task-for-edit.component';
import {EditTask} from './pages/edit-task/edit-task';
import {RemoveTask} from './pages/remove-task/remove-task';

export const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full'},
  { path: 'landing', component: LandingComponent, data: { breadcrumb: 'landing'}},
  { path: 'login', component: LoginComponent, data: { breadcrumb: 'login'}},
  { path: 'register', component: RegisterComponent, data: {breadcrumb: 'register'}},
  { path: 'recuperarContraseña', component: RecoverPasswordComponent, data: {breadcrumb: 'recover-password'}},
  { path: 'dashboard', component: DasboardComponent, canActivate: [authGuard], data: { breadcrumb: 'dashboard' } },
  { path: 'dashboard/:id', component: TaskCardComponent, canActivate: [authGuard], resolve: { task: taskResolver }, data: { breadcrumb: 'task-details'}},
  { path: 'selectTask', component: SelectTaskForEditComponent, canActivate: [authGuard], data: {breadcrumb: 'select-task'}},
  { path: 'selectTask/:id', component: EditTask, canActivate: [authGuard], data: {breadcrumb: 'edit-task'}},
  { path: 'removeTask', component: RemoveTask, canActivate: [authGuard], data: {breadcrumb: 'remove-task'}},
  { path: 'calendar', component: Calendarcomponent, canActivate: [authGuard], data: { breadcrumb: 'calendar'}},
  { path: 'calendar/:id', component: TaskCardComponent, canActivate: [authGuard], data: { breadcrumb: 'task-details'}},
  { path: 'settings', canActivate: [authGuard], loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent), data: {breadcrumb: 'settings'} , children: [
      { path: '', redirectTo: 'userSettings', pathMatch: 'full' },
      { path: 'userSettings', loadChildren: () => import('./pages/user-settings/user-settings-module').then(m => m.UserSettingsModule), data: { breadcrumb: 'user-settings'}},
      { path: 'familiarGroups', loadChildren: () => import('./pages/familiar-group-settings/familiar-group-settings-module').then(m => m.FamiliarGroupSettingsModule), data: { breadcrumb: 'familiar-group-settings'} },
    ] },
  { path: 'editUserInfo/:id', component: EditUserInfoComponent, data: { breadcrumb: 'edit-user-info'}},
  { path: '**', component: NotFoundComponentComponent, data: { breadcrumb: '404'}},
];
