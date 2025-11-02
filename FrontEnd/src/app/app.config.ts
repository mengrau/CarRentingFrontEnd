import { InjectionToken } from '@angular/core';

export interface AppConfig {
  apiBase: string;
}

/**
 * Token para inyectar la configuración de la app.
 * (Se usa así: inject(APP_CONFIG) o constructor(@Inject(APP_CONFIG) cfg: AppConfig))
 */
export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');

/** Valor concreto de la configuración (cambia según dev/prod). */
export const APP_CONFIG_VALUE: AppConfig = {
  apiBase: 'http://localhost:8000/api',
};
