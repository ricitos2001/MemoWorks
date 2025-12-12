import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Header} from './components/layout/header/header';
import {Footer} from './components/layout/footer/footer';
import {Main} from './components/layout/main/main';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthInterceptor} from './interceptors/auth-interceptor';
import {LoadingInterceptor} from './interceptors/loading.interceptor-interceptor';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, Main, HttpClientModule],
  templateUrl: './app.html',
  styleUrl: '../styles/styles.css',
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }
  ]
})

export class App {
  protected readonly title = signal('MemoWorks');
}
