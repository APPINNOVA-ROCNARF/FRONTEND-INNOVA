import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import {
  MenuFoldOutline,
  MenuUnfoldOutline,
  FormOutline,
  DashboardOutline
} from '@ant-design/icons-angular/icons';

import { routes } from './app.routes';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { es_ES, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { reducers } from './state/app.state';

registerLocaleData(es);

const icons = [MenuFoldOutline, MenuUnfoldOutline, DashboardOutline, FormOutline]; // ✅ Usar array


export const appConfig: ApplicationConfig = {
  providers: [
    provideStore(reducers),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideNzIcons(icons)
  ]};
