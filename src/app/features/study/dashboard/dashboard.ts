import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon, type IconName } from '@app/shared/ui/icon/icon';
import { Catalog } from '../catalog';
import { passTone, topicTone } from '../util';
import { ScoreChart } from './score-chart';
import { SessionBars } from './session-bars';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, Icon, ScoreChart, SessionBars],
  templateUrl: './dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  readonly catalog = inject(Catalog);
  readonly stats = this.catalog.stats;
  readonly tone = topicTone;
  readonly pass = passTone;
  readonly recent = computed(() => [...this.stats().trend].reverse());
  readonly accuracyPoints = computed(() =>
    this.stats().trend.map((point) => ({ date: point.date, value: point.acc })),
  );
  readonly examPoints = computed(() =>
    this.stats().examTrend.map((point) => ({ date: point.date, value: point.score })),
  );
  readonly tools: readonly { path: string; label: string; icon: IconName }[] = [
    { path: '/app/video', label: 'Video Lessons', icon: 'video' },
    { path: '/app/flashcards', label: 'Flashcards', icon: 'layers' },
    { path: '/app/exams', label: 'Practice Exams', icon: 'clipboard-list' },
    { path: '/app/quizzes', label: 'Quizzes', icon: 'zap' },
    { path: '/app/matching', label: 'Matching', icon: 'layout-grid' },
  ];
}
