import { effect, inject, Injectable, signal } from '@angular/core';
import { Observable, of, tap, throwError } from 'rxjs';
import { ApiClient } from '@app/core/http/api-client';
import { AuthUser } from './auth-user';
import { TokenStorage } from './token-storage';

@Injectable({ providedIn: 'root' })
export class AuthSession {
  private readonly api = inject(ApiClient);
  private readonly tokens = inject(TokenStorage);
  private readonly user = signal<AuthUser | null>(null);
  private profileRequest: Observable<AuthUser> | null = null;
  private loadedFor: string | null = null;

  readonly currentUser = this.user.asReadonly();

  constructor() {
    effect(() => {
      if (this.tokens.value() === null) {
        this.user.set(null);
        this.loadedFor = null;
        this.profileRequest = null;
      }
    });
  }

  loadProfile(): Observable<AuthUser> {
    const token = this.tokens.get();
    if (!token) {
      return throwError(() => new Error('No session'));
    }
    const cached = this.user();
    if (cached && this.loadedFor === token) {
      return of(cached);
    }
    if (this.profileRequest && this.loadedFor === token) {
      return this.profileRequest;
    }
    this.loadedFor = token;
    this.profileRequest = this.api.get<AuthUser>('me').pipe(
      tap({
        next: (user) => this.user.set(user),
        error: () => {
          this.loadedFor = null;
          this.profileRequest = null;
        },
      }),
    );
    return this.profileRequest;
  }
}
