import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ENVIRONMENT } from '@app/core/config/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteFooter {
  private readonly env = inject(ENVIRONMENT);
  readonly appName = this.env.appName;
  readonly email = this.env.publicUrls.supportEmail;
  readonly year = new Date().getFullYear();
}
