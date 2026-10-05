import { vi } from 'vitest';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { environment } from '@env/environment';
import { ENVIRONMENT } from '@app/core/config/environment';
import { Toasts } from '@app/core/ui/toasts';
import { authInterceptor } from './auth.interceptor';
import { TokenStorage } from './token-storage';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: ENVIRONMENT, useValue: environment },
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    TestBed.inject(Toasts).clear();
  });

  it('adds a bearer token only for the API origin', () => {
    TestBed.inject(TokenStorage).set('abc');
    http.get(`${environment.apiBase}/me`).subscribe();
    http.get('https://example.com/file').subscribe();

    const api = httpMock.expectOne(`${environment.apiBase}/me`);
    const external = httpMock.expectOne('https://example.com/file');

    expect(api.request.headers.get('Authorization')).toBe('Bearer abc');
    expect(external.request.headers.has('Authorization')).toBe(false);

    api.flush({ success: true, message: '', data: {} });
    external.flush({});
  });

  it('clears the session on a 401', () => {
    const tokens = TestBed.inject(TokenStorage);
    const router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    tokens.set('abc');

    http.get(`${environment.apiBase}/me`).subscribe({ error: () => undefined });
    httpMock
      .expectOne(`${environment.apiBase}/me`)
      .flush({ message: 'expired' }, { status: 401, statusText: 'Unauthorized' });

    expect(tokens.get()).toBeNull();
    expect(TestBed.inject(Toasts).list()[0]?.text).toBe('Session expired');
    expect(router.navigate).toHaveBeenCalled();
  });

  it('toasts the API message for other errors', () => {
    http.get(`${environment.apiBase}/me`).subscribe({ error: () => undefined });
    httpMock
      .expectOne(`${environment.apiBase}/me`)
      .flush({ message: 'Nope' }, { status: 500, statusText: 'Server Error' });

    expect(TestBed.inject(Toasts).list()[0]?.text).toBe('Nope');
  });
});
