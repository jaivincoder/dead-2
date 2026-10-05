import { computed, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AppLoader {
  private readonly routeCount = signal(0);
  private readonly dataCount = signal(0);

  readonly routeLoading = computed(() => this.routeCount() > 0);
  readonly dataLoading = computed(() => this.dataCount() > 0);

  beginRoute(): void {
    this.routeCount.update((count) => count + 1);
  }

  endRoute(): void {
    this.routeCount.update((count) => Math.max(0, count - 1));
  }

  beginData(): void {
    this.dataCount.update((count) => count + 1);
  }

  endData(): void {
    this.dataCount.update((count) => Math.max(0, count - 1));
  }
}
