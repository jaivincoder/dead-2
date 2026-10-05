import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '@app/shared/ui/icon/icon';
import { Catalog } from '../catalog';
import type { VideoLesson } from '../models';
import { formatClock } from '../util';

@Component({
  selector: 'app-video-lessons',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './video-lessons.html',
})
export class VideoLessons {
  readonly catalog = inject(Catalog);

  lengthLabel(lesson: VideoLesson): string {
    if (!lesson.segments) {
      return lesson.est ?? '';
    }
    const total = lesson.segments.reduce((sum, segment) => sum + segment.duration, 0);
    const questions = lesson.segments.reduce((sum, segment) => sum + segment.questions.length, 0);
    return `${formatClock(total)} · ${lesson.segments.length} segments · ${questions} checkpoint questions`;
  }
}
