import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TextInput } from './input';

@Component({
  imports: [ReactiveFormsModule, TextInput],
  template: `<ui-input inputId="name" [formControl]="name" />`,
})
class NameHost {
  readonly name = new FormControl('Ada', { nonNullable: true });
}

@Component({
  imports: [ReactiveFormsModule, TextInput],
  template: `<ui-input type="number" [min]="0" [max]="10" [formControl]="qty" />`,
})
class NumberHost {
  readonly qty = new FormControl('1', { nonNullable: true });
}

describe('TextInput', () => {
  async function setup<T>(component: new () => T): Promise<ComponentFixture<T>> {
    await TestBed.configureTestingModule({ imports: [component] }).compileComponents();
    const fixture = TestBed.createComponent(component);
    await fixture.whenStable();
    return fixture;
  }

  it('writes form values into the field', async () => {
    const fixture = await setup(NameHost);
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('Ada');

    fixture.componentInstance.name.setValue('Grace');
    await fixture.whenStable();
    expect(input.value).toBe('Grace');
  });

  it('clamps numbers and blocks exponent keys', async () => {
    const fixture = await setup(NumberHost);
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = '40';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    expect(input.value).toBe('10');
    expect(fixture.componentInstance.qty.value).toBe('10');

    const event = new KeyboardEvent('keydown', { key: 'e', cancelable: true });
    input.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });
});
