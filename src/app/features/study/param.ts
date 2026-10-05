import { inject, type Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

export function paramId(): Signal<string> {
  const route = inject(ActivatedRoute);
  return toSignal(
    route.paramMap.pipe(map((params) => params.get('id') ?? '')),
    { initialValue: route.snapshot.paramMap.get('id') ?? '' },
  );
}
