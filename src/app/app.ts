import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from './components/layout/header/header.component';
import {FooterComponent} from './components/layout/footer/footer.component';
import {MainComponent} from './components/layout/main/main.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthInterceptor} from './interceptors/auth-interceptor';
import {LoadingInterceptor} from './interceptors/loading.interceptor-interceptor';
import {ToastComponent} from './components/shared/toast/toast.component';
import {SpinnerComponent} from './components/shared/spinner/spinner.component';
import {TabsComponent} from './components/shared/tabs/tabs.component';
import {ModalComponent} from './components/shared/modal/modal.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, MainComponent, HttpClientModule, ToastComponent, SpinnerComponent, TabsComponent, ModalComponent],
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
