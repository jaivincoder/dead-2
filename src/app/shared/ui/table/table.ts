import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface TableColumn<T extends object> {
  key: keyof T;
  header: string;
}

@Component({
  selector: 'ui-table',
  templateUrl: './table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTable<T extends object> {
  readonly columns = input.required<readonly TableColumn<T>[]>();
  readonly rows = input.required<readonly T[]>();
  readonly caption = input.required<string>();
  readonly rowKey = input<keyof T | null>(null);

  cell(row: T, key: keyof T): string {
    const value = row[key];
    if (value === null || value === undefined) {
      return '';
    }
    return String(value);
  }

  track(row: T, index: number): unknown {
    const key = this.rowKey();
    if (key !== null && key in row) {
      return row[key];
    }
    return index;
  }
}
