import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthSession } from './auth-session';
import { TokenStorage } from './token-storage';

function signInRedirect(router: Router, url: string) {
  return router.createUrlTree(['/'], {
    queryParams: { returnUrl: url },
  });
}

export const authGuard: CanActivateFn = (_route, state) => {
  const tokens = inject(TokenStorage);
  const session = inject(AuthSession);
  const router = inject(Router);
  if (!tokens.get()) {
    return signInRedirect(router, state.url);
  }
  return session.loadProfile().pipe(
    map(() => true),
    catchError(() => of(signInRedirect(router, state.url))),
  );
};

export function roleGuard(role: string): CanActivateFn {
  return (_route, state) => {
    const tokens = inject(TokenStorage);
    const session = inject(AuthSession);
    const router = inject(Router);
    const redirect = signInRedirect(router, state.url);
    if (!tokens.get()) {
      return redirect;
    }
    return session.loadProfile().pipe(
      map((user) => (user.roles.includes(role) ? true : redirect)),
      catchError(() => of(redirect)),
    );
  };
}
