import {Routes} from '@angular/router';
import {authGuard} from './guards/auth-guard';
import {taskResolver} from './resolvers/task-resolver';
import {StyleGuideComponent} from './pages/style-guide/style-guide.component';
import {LoginComponent} from './pages/login/login.component';
import {RegisterComponent} from './pages/register/register.component';

export const routes: Routes = [
  {path: '', redirectTo: 'landing', pathMatch: 'full'},
  {
    path: 'landing',
    loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent),
    data: {breadcrumb: 'landing'}
  },
  {
    path: 'terms',
    loadComponent: () => import('./pages/terms/terms.component').then(m => m.TermsComponent),
    data: {breadcrumb: 'terms'}
  },
  {
    path: 'warning',
    loadComponent: () => import('./pages/warning/warning.component').then(m => m.WarningComponent),
    data: {breadcrumb: 'warning'}
  },
  {
    path: 'privacy',
    loadComponent: () => import('./pages/privacy/privacy.component').then(m => m.PrivacyComponent),
    data: {breadcrumb: 'privacy'}
  },
  {
    path: 'cookies',
    loadComponent: () => import('./pages/cookies/cookies.component').then(m => m.CookiesComponent),
    data: {breadcrumb: 'cookies'}
  },
  {
    path: 'users',
    loadComponent: () => import('./pages/users/users').then(m => m.Users),
    data: {title: 'User-list', breadcrumb: 'User-list'}
  },
  {path: 'styles', component: StyleGuideComponent, data: {breadcrumb: 'style-guide'}},
  {path: 'login', component: LoginComponent, data: {breadcrumb: 'login'}},
  {path: 'register', component: RegisterComponent, data: {breadcrumb: 'register'}},
  {path: 'reset-password', redirectTo: 'recoverPassword', pathMatch: 'full'},
  {
    path: 'recoverPassword',
    loadComponent: () => import('./pages/recover-password/recover-password.component').then(m => m.RecoverPasswordComponent),
    data: {breadcrumb: 'recover-password'}
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dasboard/dasboard.component').then(m => m.DasboardComponent),
    canActivate: [authGuard],
    data: {breadcrumb: 'dashboard'}
  },
  {
    path: 'calendar',
    loadComponent: () => import('./pages/calendar/calendar.component').then(m => m.CalendarComponent),
    canActivate: [authGuard],
    data: {breadcrumb: 'calendar'}
  },
  {
    path: 'task/:id',
    loadComponent: () => import('./components/shared/task-card/task-card.component').then(m => m.TaskCardComponent),
    canActivate: [authGuard],
    resolve: {task: taskResolver},
    data: {breadcrumb: 'task-details'}
  },
  {
    path: 'settings',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent),
    data: {breadcrumb: 'settings'},
    children: [
      {path: '', redirectTo: 'userSettings', pathMatch: 'full'},
      {
        path: 'userSettings',
        loadChildren: () => import('./pages/user-settings/user-settings-module').then(m => m.UserSettingsModule),
        data: {breadcrumb: 'user-settings'}
      },
      {
        path: 'familiarGroups',
        loadChildren: () => import('./pages/familiar-group-settings/familiar-group-settings-module').then(m => m.FamiliarGroupSettingsModule),
        data: {breadcrumb: 'familiar-group-settings'}
      },
      {
        path: 'familiarGroups/:id',
        loadChildren: () => import('./pages/all-members/all-members-module').then(m => m.AllMembersModule),
        data: {breadcrumb: 'All-members'}
      },
      {
        path: 'accessibility',
        loadChildren: () => import('./pages/accessibility/accessibility-module').then(m => m.AccessibilityModule),
        data: {breadcrumb: 'accessibility'}
      },
    ]
  },
  {
    path: 'editUserInfo/:id',
    loadComponent: () => import('./pages/edit-user-info/edit-user-info.component').then(m => m.EditUserInfoComponent),
    data: {breadcrumb: 'edit-user-info'}
  },
  {
    path: 'selectTask',
    loadComponent: () => import('./pages/select-task-for-edit/select-task-for-edit.component').then(m => m.SelectTaskForEditComponent),
    canActivate: [authGuard],
    data: {breadcrumb: 'select-task'}
  },
  {
    path: 'selectTask/:id',
    loadComponent: () => import('./pages/edit-task/edit-task.component').then(m => m.EditTaskComponent),
    canActivate: [authGuard],
    data: {breadcrumb: 'edit-task'}
  },
  {
    path: 'removeTask',
    loadComponent: () => import('./pages/remove-task/remove-task.component').then(m => m.RemoveTaskComponent),
    canActivate: [authGuard],
    data: {breadcrumb: 'remove-task'}
  },
  {
    path: 'createGroup',
    loadComponent: () => import('./pages/create-group/create-group.component').then(m => m.CreateGroupComponent),
    canActivate: [authGuard],
    data: {breadcrumb: 'create-group'}
  },
  {
    path: 'editGroup/:id',
    loadComponent: () => import('./pages/edit-group/edit-group.component').then(m => m.EditGroupComponent),
    canActivate: [authGuard],
    data: {breadcrumb: 'edit-group'}
  },
  {
    path: '**',
    loadComponent: () => import('./pages/notfound/not-found.component').then(m => m.NotFoundComponent),
    data: {breadcrumb: '404'}
  },
];
