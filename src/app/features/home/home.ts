import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { Toasts } from '@app/core/ui/toasts';
import { Button } from '@app/shared/ui/button/button';
import { Checkbox } from '@app/shared/ui/checkbox/checkbox';
import { TextInput } from '@app/shared/ui/input/input';
import { Modal } from '@app/shared/ui/modal/modal';
import { SelectField, SelectOption } from '@app/shared/ui/select/select';
import { DataTable, TableColumn } from '@app/shared/ui/table/table';

interface DemoRow {
  id: string;
  name: string;
  status: string;
}

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule, Button, TextInput, SelectField, Checkbox, Modal, DataTable],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private readonly toasts = inject(Toasts);
  private readonly route = inject(ActivatedRoute);

  readonly needsSignIn = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.has('returnUrl'))),
    { initialValue: false },
  );
  readonly dialogOpen = signal(false);
  readonly submitted = signal(false);
  readonly roles: readonly SelectOption[] = [
    { value: 'member', label: 'Member' },
    { value: 'admin', label: 'Admin' },
  ];
  readonly columns: readonly TableColumn<DemoRow>[] = [
    { key: 'name', header: 'Name' },
    { key: 'status', header: 'Status' },
  ];
  readonly rows: readonly DemoRow[] = [
    { id: '1', name: 'North', status: 'Ready' },
    { id: '2', name: 'South', status: 'Queued' },
  ];
  readonly form = new FormGroup({
    displayName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(80)],
    }),
    role: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    agree: new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
  });

  showError(name: 'displayName' | 'role' | 'agree'): boolean {
    const control = this.form.controls[name];
    return (this.submitted() || control.touched) && control.invalid;
  }

  openDialog(): void {
    this.dialogOpen.set(true);
  }

  closeDialog(): void {
    this.dialogOpen.set(false);
  }

  onSubmit(): void {
    this.submitted.set(true);
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.toasts.success('Form is valid.');
  }
}
