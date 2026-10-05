import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { AppLoader } from '@app/core/loading/app-loader';
import { SiteFooter } from '@app/layout/footer/footer';
import { Header } from '@app/layout/header/header';
import { ToastHost } from '@app/layout/toast-host/toast-host';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, SiteFooter, ToastHost],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly loader = inject(AppLoader);
  private readonly router = inject(Router);

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.loader.beginRoute();
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loader.endRoute();
      }
    });
  }
}
