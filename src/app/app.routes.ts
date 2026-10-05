import { Routes } from '@angular/router';
import { authGuard } from '@app/core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    title: 'Home',
    loadComponent: () => import('./features/home/home').then((module) => module.Home),
  },
  {
    path: 'account',
    title: 'Account',
    canActivate: [authGuard],
    loadComponent: () => import('./features/account/account').then((module) => module.Account),
  },
  { path: '**', redirectTo: '' },
];
