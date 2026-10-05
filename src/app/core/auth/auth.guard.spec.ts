import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  provideRouter,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from '@env/environment';
import { ENVIRONMENT } from '@app/core/config/environment';
import { Toasts } from '@app/core/ui/toasts';
import { authGuard, roleGuard } from './auth.guard';
import { authInterceptor } from './auth.interceptor';
import { TokenStorage } from './token-storage';

describe('authGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: ENVIRONMENT, useValue: environment },
      ],
    });
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
    TestBed.inject(Toasts).clear();
    localStorage.clear();
  });

  it('redirects when there is no token', () => {
    const router = TestBed.inject(Router);
    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, { url: '/account' } as RouterStateSnapshot),
    );

    expect(result).toBeInstanceOf(UrlTree);
    expect(router.serializeUrl(result as UrlTree)).toContain('returnUrl');
  });

  it('allows the route after a profile load', async () => {
    TestBed.inject(TokenStorage).set('tok');
    const pending = TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, { url: '/account' } as RouterStateSnapshot),
    ) as Observable<boolean | UrlTree>;
    const result = firstValueFrom(pending);
    const request = TestBed.inject(HttpTestingController).expectOne(`${environment.apiBase}/me`);

    expect(request.request.headers.get('Authorization')).toBe('Bearer tok');
    request.flush({
      success: true,
      message: '',
      data: { id: '1', email: 'a@b.c', roles: ['member'] },
    });

    expect(await result).toBe(true);
  });

  it('rejects a role the profile does not have', async () => {
    TestBed.inject(TokenStorage).set('tok');
    const router = TestBed.inject(Router);
    const pending = TestBed.runInInjectionContext(() =>
      roleGuard('admin')({} as ActivatedRouteSnapshot, { url: '/account' } as RouterStateSnapshot),
    ) as Observable<boolean | UrlTree>;
    const result = firstValueFrom(pending);
    TestBed.inject(HttpTestingController)
      .expectOne(`${environment.apiBase}/me`)
      .flush({
        success: true,
        message: '',
        data: { id: '1', email: 'a@b.c', roles: ['member'] },
      });

    const url = await result;
    expect(url).toBeInstanceOf(UrlTree);
    expect(router.serializeUrl(url as UrlTree)).toContain('returnUrl');
  });
});
