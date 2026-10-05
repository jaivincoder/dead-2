import { TestBed } from '@angular/core/testing';
import { TokenStorage } from './token-storage';

describe('TokenStorage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('keeps the token in memory', () => {
    localStorage.setItem('sentinel', '1');
    const storage = TestBed.inject(TokenStorage);

    storage.set('secret');

    expect(storage.get()).toBe('secret');
    expect(localStorage.getItem('sentinel')).toBe('1');
    expect(localStorage.getItem('db-access-token')).toBeNull();

    storage.clear();
    expect(storage.get()).toBeNull();
    localStorage.removeItem('sentinel');
  });
});
