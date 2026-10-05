import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '@app/shared/ui/icon/icon';
import { Catalog } from '../catalog';
import type { VideoSegment } from '../models';
import { paramId } from '../param';
import { feedbackChoice, formatClock } from '../util';

@Component({
  selector: 'app-video-player',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './video-player.html',
})
export class VideoPlayer {
  private readonly catalog = inject(Catalog);
  readonly id = paramId();
  readonly lesson = computed(() => this.catalog.playableVideo(this.id()));
  readonly blocked = computed(() => {
    const raw = this.catalog.video(this.id());
    return raw?.comingSoon ? raw : undefined;
  });
  readonly time = signal(0);
  readonly playing = signal(false);
  readonly checkpoint = signal<number | null>(null);
  readonly qi = signal(0);
  readonly picked = signal<number | null>(null);
  readonly passed = signal<ReadonlySet<number>>(new Set());
  readonly look = feedbackChoice;
  readonly clock = formatClock;
  readonly total = computed(() => durationOf(this.lesson()?.segments ?? []));
  readonly currentSegment = computed(() => {
    const lesson = this.lesson();
    if (!lesson) {
      return 0;
    }
    return segAt(lesson.segments, Math.min(this.time(), Math.max(this.total() - 0.01, 0)));
  });
  readonly prompt = computed(() => {
    const lesson = this.lesson();
    const checkpoint = this.checkpoint();
    if (!lesson || checkpoint === null) {
      return undefined;
    }
    return lesson.segments[checkpoint]?.questions[this.qi()];
  });

  constructor() {
    const timer = setInterval(() => this.tick(), 100);
    inject(DestroyRef).onDestroy(() => clearInterval(timer));
  }

  togglePlay(): void {
    this.playing.update((value) => !value);
  }

  answer(choice: number): void {
    if (this.picked() === null) {
      this.picked.set(choice);
    }
  }

  resume(): void {
    const lesson = this.lesson();
    const checkpoint = this.checkpoint();
    if (!lesson || checkpoint === null) {
      return;
    }
    const segment = lesson.segments[checkpoint];
    if (this.qi() + 1 < segment.questions.length) {
      this.qi.update((value) => value + 1);
      this.picked.set(null);
      return;
    }
    this.passed.update((current) => new Set([...current, checkpoint]));
    const nextStart = segStart(lesson.segments, checkpoint) + segment.duration;
    this.checkpoint.set(null);
    this.picked.set(null);
    if (nextStart < durationOf(lesson.segments)) {
      this.time.set(nextStart);
      this.playing.set(true);
      return;
    }
    this.time.set(durationOf(lesson.segments));
  }

  jump(index: number): void {
    const lesson = this.lesson();
    if (!lesson) {
      return;
    }
    this.checkpoint.set(null);
    this.picked.set(null);
    this.time.set(segStart(lesson.segments, index));
    this.playing.set(true);
  }

  progress(index: number): number {
    const lesson = this.lesson();
    if (!lesson) {
      return 0;
    }
    const start = segStart(lesson.segments, index);
    const length = lesson.segments[index]?.duration ?? 1;
    return Math.min(1, Math.max(0, (this.time() - start) / length));
  }

  private tick(): void {
    const lesson = this.lesson();
    if (!lesson || !this.playing() || this.checkpoint() !== null) {
      return;
    }
    const segments = lesson.segments;
    const total = durationOf(segments);
    const previous = this.time();
    const next = previous + 0.1;
    const index = segAt(segments, previous);
    const boundary = segStart(segments, index) + segments[index].duration;
    if (next >= boundary) {
      if (!this.passed().has(index) && segments[index].questions.length) {
        this.playing.set(false);
        this.checkpoint.set(index);
        this.qi.set(0);
        this.picked.set(null);
        this.time.set(boundary - 0.01);
        return;
      }
      if (next >= total) {
        this.playing.set(false);
        this.time.set(total);
        return;
      }
    }
    this.time.set(Math.min(next, total));
  }
}

function durationOf(segments: readonly VideoSegment[]): number {
  return segments.reduce((sum, segment) => sum + segment.duration, 0);
}

function segStart(segments: readonly VideoSegment[], index: number): number {
  return segments.slice(0, index).reduce((sum, segment) => sum + segment.duration, 0);
}

function segAt(segments: readonly VideoSegment[], time: number): number {
  let cursor = 0;
  for (let index = 0; index < segments.length; index += 1) {
    cursor += segments[index].duration;
    if (time < cursor) {
      return index;
    }
  }
  return Math.max(0, segments.length - 1);
}
