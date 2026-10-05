import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface ChartPoint {
  date: string;
  value: number;
}

interface ChartDot {
  x: number;
  y: number;
  label: string;
}

interface ChartModel {
  w: number;
  h: number;
  padL: number;
  padR: number;
  grids: { y: number; label: number }[];
  pts: string;
  area: string;
  dots: ChartDot[];
  refY: number | null;
}

@Component({
  selector: 'app-score-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (model(); as chart) {
      <svg
        [attr.viewBox]="'0 0 ' + chart.w + ' ' + chart.h"
        class="block w-full"
        role="img"
        [attr.aria-label]="label()"
      >
        @for (grid of chart.grids; track grid.label) {
          <line
            [attr.x1]="chart.padL"
            [attr.x2]="chart.w - chart.padR"
            [attr.y1]="grid.y"
            [attr.y2]="grid.y"
            stroke="var(--c-surface-hi)"
            stroke-width="1"
          />
          <text
            [attr.x]="chart.padL - 4"
            [attr.y]="grid.y + 3"
            text-anchor="end"
            font-size="7"
            fill="var(--c-dim)"
            font-family="DM Mono, monospace"
          >
            {{ grid.label }}
          </text>
        }
        @if (chart.refY !== null) {
          <line
            [attr.x1]="chart.padL"
            [attr.x2]="chart.w - chart.padR"
            [attr.y1]="chart.refY"
            [attr.y2]="chart.refY"
            stroke="var(--c-warn)"
            stroke-width="1"
            stroke-dasharray="3 3"
          />
          <text
            [attr.x]="chart.w - chart.padR"
            [attr.y]="chart.refY - 3"
            text-anchor="end"
            font-size="7"
            fill="var(--c-warn)"
            font-family="DM Mono, monospace"
          >
            {{ refLabel() }}
          </text>
        }
        <polygon [attr.points]="chart.area" [attr.fill]="areaFill()" />
        <polyline
          [attr.points]="chart.pts"
          fill="none"
          [attr.stroke]="color()"
          stroke-width="2"
          stroke-linejoin="round"
        />
        @for (dot of chart.dots; track $index) {
          <circle [attr.cx]="dot.x" [attr.cy]="dot.y" r="2.5" [attr.fill]="color()" />
          <text
            [attr.x]="dot.x"
            [attr.y]="chart.h - 6"
            text-anchor="middle"
            font-size="6.5"
            fill="var(--c-dim)"
            font-family="DM Mono, monospace"
          >
            {{ dot.label }}
          </text>
        }
      </svg>
    }
  `,
})
export class ScoreChart {
  readonly points = input.required<readonly ChartPoint[]>();
  readonly color = input('var(--c-primary)');
  readonly label = input('Score chart');
  readonly refValue = input<number | null>(null);
  readonly refLabel = input('');

  readonly areaFill = computed(
    () => `color-mix(in srgb, ${this.color()} 13%, transparent)`,
  );
  readonly model = computed(() => buildChart(this.points(), this.refValue()));
}

function buildChart(points: readonly ChartPoint[], refValue: number | null): ChartModel | null {
  if (!points.length) {
    return null;
  }
  const w = 300;
  const h = 120;
  const padL = 26;
  const padR = 22;
  const padT = 10;
  const padB = 18;
  const x = (index: number) => padL + (index * (w - padL - padR)) / Math.max(1, points.length - 1);
  const y = (value: number) => padT + (1 - value / 100) * (h - padT - padB);
  const dots = points.map((point, index) => ({ x: x(index), y: y(point.value), label: point.date }));
  const pts = dots.map((dot) => `${dot.x},${dot.y}`).join(' ');
  const area = `${dots[0].x},${h - padB} ${pts} ${dots[dots.length - 1].x},${h - padB}`;
  return {
    w,
    h,
    padL,
    padR,
    grids: [0, 25, 50, 75, 100].map((label) => ({ y: y(label), label })),
    pts,
    area,
    dots,
    refY: refValue == null ? null : y(refValue),
  };
}
