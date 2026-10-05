import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ENVIRONMENT } from '@app/core/config/environment';
import { SKIP_ERROR_TOAST } from '@app/core/http/skip-error-toast';
import { Toasts } from '@app/core/ui/toasts';
import { TokenStorage } from './token-storage';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const env = inject(ENVIRONMENT);
  const tokens = inject(TokenStorage);
  const router = inject(Router);
  const toasts = inject(Toasts);
  const base = env.apiBase.replace(/\/$/, '');
  const token = tokens.get();
  const isApi = Boolean(base) && req.url.startsWith(base);

  if (token && isApi) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && !req.context.get(SKIP_ERROR_TOAST)) {
        if (error.status === 401 && isApi) {
          tokens.clear();
          toasts.error('Session expired');
          const current = router.url.split('?')[0];
          void router.navigate(['/'], {
            queryParams: current && current !== '/' ? { returnUrl: current } : {},
          });
        } else if (error.status !== 401) {
          toasts.error(readMessage(error));
        }
      }
      return throwError(() => error);
    }),
  );
};

function readMessage(error: HttpErrorResponse): string {
  const body: unknown = error.error;
  if (body && typeof body === 'object' && 'message' in body && typeof body.message === 'string') {
    return body.message;
  }
  return 'Something went wrong';
}
