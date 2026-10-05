import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { Theme } from '@app/core/theme/theme';
import { Toasts } from '@app/core/ui/toasts';
import { Icon } from '@app/shared/ui/icon/icon';
import { Catalog } from '@app/features/study/catalog';
import { StudyAccountStore } from '@app/features/study/study-account';

@Component({
  selector: 'app-auth-page',
  imports: [RouterLink, Icon],
  templateUrl: './auth-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class AuthPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly account = inject(StudyAccountStore);
  private readonly toasts = inject(Toasts);
  readonly theme = inject(Theme);
  readonly catalog = inject(Catalog);

  readonly signup = toSignal(
    this.route.data.pipe(map((data) => data['mode'] === 'signup')),
    { initialValue: this.route.snapshot.data['mode'] === 'signup' },
  );
  readonly name = signal('');
  readonly email = signal('');
  readonly password = signal('');
  readonly stateCode = signal('');
  readonly canSubmit = computed(() => !this.signup() || this.stateCode().length > 0);

  submit(): void {
    if (!this.canSubmit()) {
      return;
    }
    this.account.signIn({
      name: this.signup() ? this.name() : undefined,
      email: this.email(),
      stateCode: this.signup() ? this.stateCode() : undefined,
    });
    void this.router.navigateByUrl(safeAppPath(this.route.snapshot.queryParamMap.get('returnUrl')));
  }

  forgot(event: Event): void {
    event.preventDefault();
    this.toasts.info("Password reset isn't available until the account API is connected.");
  }
}

function safeAppPath(url: string | null): string {
  if (!url) {
    return '/app/dashboard';
  }
  if (url === '/app' || url.startsWith('/app/') || url.startsWith('/app?')) {
    return url;
  }
  return '/app/dashboard';
}
