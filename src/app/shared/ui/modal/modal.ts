import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'ui-modal',
  templateUrl: './modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Modal {
  readonly open = input(false);
  readonly title = input('');
  readonly titleId = input('dialog-title');
  readonly closed = output<void>();

  private readonly dialogEl = viewChild<ElementRef<HTMLDialogElement>>('dialog');

  constructor() {
    effect((onCleanup) => {
      const dialog = this.dialogEl()?.nativeElement;
      const isOpen = this.open();
      if (!dialog) {
        return;
      }
      if (isOpen && !dialog.open) {
        dialog.showModal();
      } else if (!isOpen && dialog.open) {
        dialog.close();
      }
      const onClick = (event: MouseEvent): void => {
        if (event.target === dialog) {
          this.closed.emit();
        }
      };
      dialog.addEventListener('click', onClick);
      onCleanup(() => dialog.removeEventListener('click', onClick));
    });
  }

  onCancel(event: Event): void {
    event.preventDefault();
    this.closed.emit();
  }
}
