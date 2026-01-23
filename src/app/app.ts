import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import {HeaderComponent} from './components/layout/header/header.component';
import {FooterComponent} from './components/layout/footer/footer.component';
import {MainComponent} from './components/layout/main/main.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthInterceptor} from './interceptors/auth-interceptor';
import {LoadingInterceptor} from './interceptors/loading.interceptor-interceptor';
import {ToastComponent} from './components/shared/toast/toast.component';
import {SpinnerComponent} from './components/shared/spinner/spinner.component';
import { Title } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, MainComponent, HttpClientModule, ToastComponent, SpinnerComponent],
  templateUrl: './app.html',
  styleUrl: '../styles/styles.css',
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }
  ]
})

export class App implements OnInit {
  protected readonly title = signal('MemoWorks');
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private titleService = inject(Title);

  ngOnInit(): void {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(() => {
      let route = this.activatedRoute;
      while (route.firstChild) {
        route = route.firstChild;
      }
      const routeTitle = route.snapshot.data && route.snapshot.data['title'];
      const finalTitle = routeTitle ? `${routeTitle} — ${this.title()}` : this.title();
      this.titleService.setTitle(finalTitle as string);
    });
  }
}
