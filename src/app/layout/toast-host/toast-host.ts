import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Toasts } from '@app/core/ui/toasts';

@Component({
  selector: 'app-toast-host',
  templateUrl: './toast-host.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastHost {
  readonly toasts = inject(Toasts);
}
