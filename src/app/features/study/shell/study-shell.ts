import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Theme } from '@app/core/theme/theme';
import { Icon, type IconName } from '@app/shared/ui/icon/icon';
import { StudyAccountStore } from '../study-account';

interface NavItem {
  path: string;
  label: string;
  icon: IconName;
  featured: boolean;
}

@Component({
  selector: 'app-study-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Icon],
  templateUrl: './study-shell.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class StudyShell {
  private readonly router = inject(Router);
  readonly theme = inject(Theme);
  readonly account = inject(StudyAccountStore);
  readonly nav: readonly NavItem[] = [
    { path: '/app/video', label: 'Video Lessons', icon: 'video', featured: true },
    { path: '/app/dashboard', label: 'Dashboard', icon: 'layout-dashboard', featured: false },
    { path: '/app/flashcards', label: 'Flashcards', icon: 'layers', featured: false },
    { path: '/app/exams', label: 'Practice Exam', icon: 'clipboard-list', featured: false },
    { path: '/app/quizzes', label: 'Quizzes', icon: 'zap', featured: false },
    { path: '/app/matching', label: 'Matching', icon: 'layout-grid', featured: false },
  ];

  signOut(): void {
    this.account.signOut();
    void this.router.navigateByUrl('/');
  }
}
