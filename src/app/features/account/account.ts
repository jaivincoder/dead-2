import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Account {}
