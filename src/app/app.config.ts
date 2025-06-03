import { ApplicationConfig, importProvidersFrom, InjectionToken, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { environment } from '../environments/environment';

import {
  MenuFoldOutline,
  MenuUnfoldOutline,
  FormOutline,
  DashboardOutline
} from '@ant-design/icons-angular/icons';

import { routes } from './app.routes';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { es_ES, provideNzI18n } from 'ng-zorro-antd/i18n';
import { AuthInterceptor } from './core/auth/interceptors/auth.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { NzModalModule } from 'ng-zorro-antd/modal';

registerLocaleData(es);

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => environment.apiUrl
});

const icons = [MenuFoldOutline, MenuUnfoldOutline, DashboardOutline, FormOutline];


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    provideNzIcons(icons),
    provideNzI18n(es_ES),
    { provide: LOCALE_ID, useValue: 'es' },
    { provide: API_BASE_URL, useValue: environment.apiUrl },
    importProvidersFrom(NzModalModule),
  ],
};
