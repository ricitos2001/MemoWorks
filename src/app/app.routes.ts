import { Routes } from '@angular/router';
import {Landing} from './pages/landing/landing';
import {Login} from './pages/login/login';
import {Register} from './pages/register/register';
import {Dasboard} from './pages/dasboard/dasboard';
import {Calendar} from './pages/calendar/calendar';
import {Config} from './pages/config/config';

export const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'landing', component: Landing },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'dashboard', component: Dasboard },
  { path: 'calendar', component: Calendar },
  { path: 'configuration', component: Config}
];
