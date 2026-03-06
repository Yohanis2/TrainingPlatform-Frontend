import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import {
  AppstoreOutline,
  BellOutline,
  CalendarOutline,
  CheckCircleOutline,
  CloseOutline,
  DownOutline,
  EnvironmentOutline,
  MailOutline,
  MessageOutline,
  MenuOutline,
  NotificationOutline,
  PhoneOutline,
  StarOutline,
  TeamOutline,
  ToolOutline,
  UserOutline
} from '@ant-design/icons-angular/icons';

import { routes } from './app.routes';
import { authInterceptor } from './core/services/auth.interceptor';
import en from '@angular/common/locales/en';

registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideAnimations(),
    provideNzI18n(en_US),
    provideNzIcons([
      AppstoreOutline,
      BellOutline,
      CalendarOutline,
      CheckCircleOutline,
      CloseOutline,
      DownOutline,
      EnvironmentOutline,
      MailOutline,
      MessageOutline,
      MenuOutline,
      NotificationOutline,
      PhoneOutline,
      StarOutline,
      TeamOutline,
      ToolOutline,
      UserOutline
    ])
  ]
};
