import { ApplicationConfig, provideBrowserGlobalErrorListeners , LOCALE_ID} from '@angular/core';
import { provideRouter, withPreloading } from '@angular/router';
import { routes } from './app.routes';
import { PreloadAllModules } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes,
      withPreloading(PreloadAllModules)),
    { provide: LOCALE_ID, useValue: 'es-ES' }
  ]
};
