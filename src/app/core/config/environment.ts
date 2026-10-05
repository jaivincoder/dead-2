import { InjectionToken } from '@angular/core';
import { PublicUrls } from '@env/public-urls';

export interface AppEnvironment {
  production: boolean;
  appName: string;
  apiBase: string;
  publicUrls: PublicUrls;
}

export const ENVIRONMENT = new InjectionToken<AppEnvironment>('ENVIRONMENT');
