import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { fieldClasses, FieldSize } from '@app/shared/ui/field-classes';

export interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'ui-select',
  templateUrl: './select.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectField),
      multi: true,
    },
  ],
})
export class SelectField implements ControlValueAccessor {
  readonly options = input.required<readonly SelectOption[]>();
  readonly placeholder = input('Choose');
  readonly inputId = input<string>();
  readonly name = input('');
  readonly size = input<FieldSize>('small');
  readonly invalid = input(false);
  readonly describedBy = input<string>();
  readonly isDisable = input(false);

  readonly value = signal('');
  private readonly disabledByControl = signal(false);
  readonly inactive = computed(() => this.disabledByControl() || this.isDisable());
  readonly fieldClass = computed(() => fieldClasses(this.size()));

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledByControl.set(isDisabled);
  }

  onChangeValue(event: Event): void {
    const element = event.target as HTMLSelectElement;
    this.value.set(element.value);
    this.onChange(element.value);
  }

  touch(): void {
    this.onTouched();
  }
}
