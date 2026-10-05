import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { ENVIRONMENT } from '@app/core/config/environment';

@Injectable()
export class AppTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly env = inject(ENVIRONMENT);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const raw = this.buildTitle(snapshot);
    const page = raw?.trim() ? raw.trim() : 'Home';
    this.title.setTitle(`${this.env.appName} - ${page}`);
  }
}
