import { Routes } from '@angular/router';
import {Landing} from './pages/landing/landing';
import {Login} from './pages/login/login';
import {Register} from './pages/register/register';
import {Dasboard} from './pages/dasboard/dasboard';
import {Calendar} from './pages/calendar/calendar';
import {Settings} from './pages/settings/settings';
import {RecoverPassword} from './pages/recover-password/recover-password';

export const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'landing', component: Landing },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'recuperarContraseña', component: RecoverPassword},
  { path: 'dashboard', component: Dasboard },
  { path: 'calendario', component: Calendar },
  { path: 'configuracion', component: Settings }
];
