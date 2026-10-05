export function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    const current = copy[index];
    copy[index] = copy[swap];
    copy[swap] = current;
  }
  return copy;
}

export function formatClock(seconds: number): string {
  const whole = Math.max(0, Math.floor(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
}

export function topicTone(value: number): string {
  if (value < 60) {
    return 'var(--c-danger)';
  }
  if (value < 80) {
    return 'var(--c-warn)';
  }
  return 'var(--c-success)';
}

export function passTone(value: number): string {
  if (value >= 75) {
    return 'var(--c-success)';
  }
  if (value >= 50) {
    return 'var(--c-warn)';
  }
  return 'var(--c-danger)';
}

export interface ChoiceLook {
  background: string;
  borderColor: string;
}

export function feedbackChoice(index: number, answer: number, picked: number | null): ChoiceLook {
  if (picked !== null && index === answer) {
    return {
      background: 'var(--c-success-soft)',
      borderColor: 'var(--c-success)',
    };
  }
  if (picked !== null && index === picked) {
    return {
      background: 'var(--c-danger-soft)',
      borderColor: 'var(--c-danger)',
    };
  }
  return { background: 'var(--c-surface-hi)', borderColor: 'transparent' };
}

export function markedChoice(selected: boolean): ChoiceLook {
  return selected
    ? {
        background: 'var(--c-primary-line)',
        borderColor: 'var(--c-accent)',
      }
    : { background: 'var(--c-surface-hi)', borderColor: 'transparent' };
}
