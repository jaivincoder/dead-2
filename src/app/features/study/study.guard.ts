import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StudyAccountStore } from './study-account';

export const studyGuard: CanActivateFn = (_route, state) => {
  const account = inject(StudyAccountStore);
  if (account.current()) {
    return true;
  }
  return inject(Router).createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};
