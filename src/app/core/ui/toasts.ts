import { Injectable, signal } from '@angular/core';

export type ToastKind = 'error' | 'success' | 'info';

export interface Toast {
  id: number;
  kind: ToastKind;
  text: string;
}

@Injectable({ providedIn: 'root' })
export class Toasts {
  private readonly items = signal<Toast[]>([]);
  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();
  private nextId = 0;

  readonly list = this.items.asReadonly();

  error(text: string): void {
    this.show('error', text);
  }

  success(text: string): void {
    this.show('success', text);
  }

  info(text: string): void {
    this.show('info', text);
  }

  dismiss(id: number): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
    this.items.update((list) => list.filter((toast) => toast.id !== id));
  }

  clear(): void {
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }
    this.timers.clear();
    this.items.set([]);
  }

  private show(kind: ToastKind, text: string): void {
    const id = ++this.nextId;
    this.items.update((list) => [...list, { id, kind, text }]);
    this.timers.set(
      id,
      setTimeout(() => this.dismiss(id), 5000),
    );
  }
}
