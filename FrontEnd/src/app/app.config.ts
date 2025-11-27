import { InjectionToken } from '@angular/core';

export interface AppConfig {
  apiBase: string;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');

export const APP_CONFIG_VALUE: AppConfig = {
  apiBase: 'http://localhost:8000/api',
};
