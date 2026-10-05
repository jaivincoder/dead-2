import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Lucide icons used by the Anubis Legal design (ISC). */
export type IconName = 'sun' | 'moon' | 'play' | 'pause' | 'flag' | 'shuffle' | 'chevron-left' | 'chevron-right' | 'layout-dashboard' | 'layers' | 'clipboard-list' | 'zap' | 'layout-grid' | 'video' | 'check' | 'arrow-right' | 'rotate-ccw' | 'alert' | 'map-pin' | 'chevron-down' | 'log-out' | 'play-circle' | 'bar-chart' | 'timer' | 'graduation-cap';

@Component({
  selector: 'ui-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex shrink-0' },
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      stroke="currentColor"
      [attr.stroke-width]="stroke()"
      [attr.fill]="fill() ?? 'none'"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      @switch (name()) {
      @case ('sun') {
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      }
      @case ('moon') {
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      }
      @case ('play') {
        <polygon points="6 3 20 12 6 21 6 3" />
      }
      @case ('pause') {
        <rect x="14" y="4" width="4" height="16" rx="1" />
        <rect x="6" y="4" width="4" height="16" rx="1" />
      }
      @case ('flag') {
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
        <line x1="4" x2="4" y1="22" y2="15" />
      }
      @case ('shuffle') {
        <path d="m18 14 4 4-4 4" />
        <path d="m18 2 4 4-4 4" />
        <path d="M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22" />
        <path d="M2 6h1.972a4 4 0 0 1 3.6 2.2" />
        <path d="M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45" />
      }
      @case ('chevron-left') {
        <path d="m15 18-6-6 6-6" />
      }
      @case ('chevron-right') {
        <path d="m9 18 6-6-6-6" />
      }
      @case ('layout-dashboard') {
        <rect width="7" height="9" x="3" y="3" rx="1" />
        <rect width="7" height="5" x="14" y="3" rx="1" />
        <rect width="7" height="9" x="14" y="12" rx="1" />
        <rect width="7" height="5" x="3" y="16" rx="1" />
      }
      @case ('layers') {
        <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
        <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" />
        <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" />
      }
      @case ('clipboard-list') {
        <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <path d="M12 11h4" />
        <path d="M12 16h4" />
        <path d="M8 11h.01" />
        <path d="M8 16h.01" />
      }
      @case ('zap') {
        <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
      }
      @case ('layout-grid') {
        <rect width="7" height="7" x="3" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="14" rx="1" />
        <rect width="7" height="7" x="3" y="14" rx="1" />
      }
      @case ('video') {
        <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
        <rect x="2" y="6" width="14" height="12" rx="2" />
      }
      @case ('check') {
        <path d="M20 6 9 17l-5-5" />
      }
      @case ('arrow-right') {
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      }
      @case ('rotate-ccw') {
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
      }
      @case ('alert') {
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      }
      @case ('map-pin') {
        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
        <circle cx="12" cy="10" r="3" />
      }
      @case ('chevron-down') {
        <path d="m6 9 6 6 6-6" />
      }
      @case ('log-out') {
        <path d="m16 17 5-5-5-5" />
        <path d="M21 12H9" />
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      }
      @case ('play-circle') {
        <circle cx="12" cy="12" r="10" />
        <polygon points="10 8 16 12 10 16 10 8" />
      }
      @case ('bar-chart') {
        <path d="M3 3v16a2 2 0 0 0 2 2h16" />
        <path d="M18 17V9" />
        <path d="M13 17V5" />
        <path d="M8 17v-3" />
      }
      @case ('timer') {
        <line x1="10" x2="14" y1="2" y2="2" />
        <line x1="12" x2="15" y1="14" y2="11" />
        <circle cx="12" cy="14" r="8" />
      }
      @case ('graduation-cap') {
        <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
        <path d="M22 10v6" />
        <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
      }
      }
    </svg>
  `,
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly size = input(15);
  readonly stroke = input(2);
  readonly fill = input<string | null>(null);
}
