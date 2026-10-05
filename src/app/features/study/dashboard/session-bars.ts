import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { SessionMode } from '../models';

export interface VolumeBar {
  date: string;
  n: number;
  mode: SessionMode;
}

interface Bar {
  x: number;
  y: number;
  w: number;
  h: number;
  n: number;
  date: string;
  fill: string;
  opacity: number;
}

@Component({
  selector: 'app-session-bars',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (bars().length) {
      <svg viewBox="0 0 300 110" class="block w-full" role="img" aria-label="Questions answered per session">
        @for (bar of bars(); track bar.date) {
          <rect
            [attr.x]="bar.x"
            [attr.y]="bar.y"
            [attr.width]="bar.w"
            [attr.height]="bar.h"
            rx="3"
            [attr.fill]="bar.fill"
            [attr.opacity]="bar.opacity"
          />
          <text
            [attr.x]="bar.x + bar.w / 2"
            [attr.y]="bar.y - 4"
            text-anchor="middle"
            font-size="7.5"
            fill="var(--c-text)"
            font-family="DM Mono, monospace"
          >
            {{ bar.n }}
          </text>
          <text
            [attr.x]="bar.x + bar.w / 2"
            y="104"
            text-anchor="middle"
            font-size="6.5"
            fill="var(--c-dim)"
            font-family="DM Mono, monospace"
          >
            {{ bar.date }}
          </text>
        }
      </svg>
    }
  `,
})
export class SessionBars {
  readonly data = input.required<readonly VolumeBar[]>();
  readonly bars = computed(() => layout(this.data()));
}

function layout(data: readonly VolumeBar[]): Bar[] {
  if (!data.length) {
    return [];
  }
  const width = 300;
  const height = 110;
  const padB = 18;
  const padT = 14;
  const gap = 10;
  const barWidth = (width - gap * (data.length + 1)) / data.length;
  const max = Math.max(...data.map((item) => item.n), 1);
  return data.map((item, index) => {
    const barHeight = (item.n / max) * (height - padT - padB);
    const x = gap + index * (barWidth + gap);
    return {
      x,
      y: height - padB - barHeight,
      w: barWidth,
      h: barHeight,
      n: item.n,
      date: item.date,
      fill: item.mode === 'exam' ? 'var(--c-primary)' : 'var(--c-accent)',
      opacity: item.mode === 'exam' ? 1 : 0.65,
    };
  });
}
