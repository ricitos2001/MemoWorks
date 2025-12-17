import { Routes } from '@angular/router';
import {LandingComponent} from './pages/landing/landing.component';
import {LoginComponent} from './pages/login/login.component';
import {RegisterComponent} from './pages/register/register.component';
import {DasboardComponent} from './pages/dasboard/dasboard.component';
import {CalendarComponent} from './pages/calendar/calendar.component';
import {RecoverPasswordComponent} from './pages/recover-password/recover-password.component';
import {NotFoundComponent} from './pages/notfound/not-found.component';
import {TaskCardComponent} from './components/shared/task-card/task-card.component';
import {authGuard} from './guards/auth-guard';
import {taskResolver} from './resolvers/task-resolver';
import {EditUserInfoComponent} from './pages/edit-user-info/edit-user-info.component';
import {SelectTaskForEditComponent} from './pages/select-task-for-edit/select-task-for-edit.component';
import {EditTaskComponent} from './pages/edit-task/edit-task.component';
import {RemoveTaskComponent} from './pages/remove-task/remove-task.component';
import {PrivacyComponent} from './pages/privacy/privacy.component';
import {WarningComponent} from './pages/warning/warning.component';
import {TermsComponent} from './pages/terms/terms.component';
import {CookiesComponent} from './pages/cookies/cookies.component';

export const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full'},
  { path: 'landing', component: LandingComponent, data: { breadcrumb: 'landing'}},
  { path: 'login', component: LoginComponent, data: { breadcrumb: 'login'}},
  { path: 'register', component: RegisterComponent, data: {breadcrumb: 'register'}},
  { path: 'recoverPassword', component: RecoverPasswordComponent, data: {breadcrumb: 'recover-password'}},
  { path: 'dashboard', component: DasboardComponent, canActivate: [authGuard], data: { breadcrumb: 'dashboard' } },
  { path: 'calendar', component: CalendarComponent, canActivate: [authGuard], data: { breadcrumb: 'calendar'}},
  { path: 'task/:id', component: TaskCardComponent, canActivate: [authGuard], resolve: { task: taskResolver }, data: { breadcrumb: 'task-details'}},
  { path: 'settings', canActivate: [authGuard], loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent), data: {breadcrumb: 'settings'} , children: [
      { path: '', redirectTo: 'userSettings', pathMatch: 'full' },
      { path: 'userSettings', loadChildren: () => import('./pages/user-settings/user-settings-module').then(m => m.UserSettingsModule), data: { breadcrumb: 'user-settings'}},
      { path: 'familiarGroups', loadChildren: () => import('./pages/familiar-group-settings/familiar-group-settings-module').then(m => m.FamiliarGroupSettingsModule), data: { breadcrumb: 'familiar-group-settings'} },
    ] },
  { path: 'editUserInfo/:id', component: EditUserInfoComponent, data: { breadcrumb: 'edit-user-info'}},
  { path: 'selectTask', component: SelectTaskForEditComponent, canActivate: [authGuard], data: {breadcrumb: 'select-task'}},
  { path: 'selectTask/:id', component: EditTaskComponent, canActivate: [authGuard], data: {breadcrumb: 'edit-task'}},
  { path: 'removeTask', component: RemoveTaskComponent, canActivate: [authGuard], data: {breadcrumb: 'remove-task'}},
  { path: '**', component: NotFoundComponent, data: { breadcrumb: '404'}},
  { path: 'terms', component: TermsComponent, data: { breadcrumb: 'terms'}},
  { path: 'warning', component: WarningComponent, data: { breadcrumb: 'warning'}},
  { path: 'privacy', component: PrivacyComponent, data: { breadcrumb: 'privacy'}},
  { path: 'cookies', component: CookiesComponent, data: { breadcrumb: 'cookies'}},
];
