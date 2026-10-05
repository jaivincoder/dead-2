import { inject, Injectable, signal } from '@angular/core';
import { TokenStorage } from '@app/core/auth/token-storage';

export interface StudyAccount {
  name: string;
  email: string;
  stateCode: string;
}

const STORAGE_KEY = 'anubis-study-account';

/**
 * Mock signed-in learner.
 *
 * BACKEND: replace this with the real auth session. The password from the
 * form is intentionally not accepted or stored. When the API exists, sign-in
 * should return a token for TokenStorage and a profile for this signal.
 */
@Injectable({ providedIn: 'root' })
export class StudyAccountStore {
  private readonly tokens = inject(TokenStorage);
  private readonly account = signal<StudyAccount | null>(readAccount());

  readonly current = this.account.asReadonly();

  signIn(input: { name?: string; email: string; stateCode?: string }): void {
    const previous = this.account();
    const next: StudyAccount = {
      name: input.name?.trim() || previous?.name || 'Student',
      email: input.email.trim(),
      stateCode: input.stateCode || previous?.stateCode || 'NC',
    };
    this.account.set(next);
    writeAccount(next);
  }

  signOut(): void {
    this.account.set(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // The in-memory session is already cleared.
    }
    this.tokens.clear();
  }
}

function readAccount(): StudyAccount | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed: unknown = JSON.parse(raw);
    if (!isAccount(parsed)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeAccount(account: StudyAccount): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(account));
  } catch {
    // The in-memory session still works for this tab.
  }
}

function isAccount(value: unknown): value is StudyAccount {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    typeof record['name'] === 'string' &&
    typeof record['email'] === 'string' &&
    typeof record['stateCode'] === 'string'
  );
}
