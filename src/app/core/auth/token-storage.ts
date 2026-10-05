import { Injectable, signal } from '@angular/core';

/**
 * In-memory access token. localStorage is readable by any XSS, so the session
 * does not survive a refresh until the API can set an HttpOnly cookie.
 */
@Injectable({ providedIn: 'root' })
export class TokenStorage {
  private readonly token = signal<string | null>(null);
  readonly value = this.token.asReadonly();

  set(token: string): void {
    this.token.set(token);
  }

  get(): string | null {
    return this.token();
  }

  clear(): void {
    this.token.set(null);
  }
}
