export type FieldSize = 'default' | 'small' | 'tiny';

export function fieldClasses(size: FieldSize, extra = ''): string {
  const sizing =
    size === 'small'
      ? 'h-11 rounded-xl px-3 text-base'
      : size === 'tiny'
        ? 'h-9 rounded-lg px-3 text-sm'
        : 'rounded-xl px-5 py-3.5 text-lg';

  return [
    'w-full border border-border bg-white text-ink outline-none',
    'placeholder:text-muted',
    'focus-visible:border-primary-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-deep',
    'disabled:cursor-not-allowed disabled:opacity-60',
    sizing,
    extra,
  ]
    .filter(Boolean)
    .join(' ');
}
