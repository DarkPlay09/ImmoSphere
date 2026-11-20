import {
  ChangeDetectionStrategy,
  Component,
  computed,
  output,
  signal
} from '@angular/core';

import {
  FormControl,
  FormGroup, FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { TranslatePipe } from '@ngx-translate/core';

import {
  PropertySearchFilters,
  PropertyTransactionType
} from '../../models/property-search-filters.model';

@Component({
  selector: 'app-property-search-form',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './property-search-form.component.html',
  styleUrl: './property-search-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertySearchFormComponent {
  readonly searchRequested = output<PropertySearchFilters>();

  readonly transactionType = signal<PropertyTransactionType>('sale');
  readonly advancedOpen = signal(false);

  readonly budgetOptions = computed(() =>
    this.transactionType() === 'sale'
      ? [100000, 150000, 200000, 250000, 300000, 400000, 500000, 750000, 1000000]
      : [500, 750, 1000, 1250, 1500, 2000, 3000],
  );

  readonly form = new FormGroup({
    location: new FormControl('', { nonNullable: true }),
    propertyType: new FormControl('all', {nonNullable: true }),
    budgetMax: new FormControl('', { nonNullable: true }),
    bedrooms: new FormControl('', { nonNullable: true }),
    minArea: new FormControl<number | null>(null, {
      validators: [Validators.min(0)]
    }),
    peb: new FormControl('any', { nonNullable: true }),
  });

  setTransactionType(type: PropertyTransactionType): void {
    if (this.transactionType() === type) return;

    this.transactionType.set(type);

    this.form.controls.budgetMax.setValue('');
  }

  toggleAdvanced(): void {
    this.advancedOpen.update((value) => !value);
  }

  formatBudget(amount: number): string {
    return `${amount.toLocaleString('fr-BE')} €`;
  }

  private optionalNumber(value: string): number | null {
    return value === '' ? null : Number(value);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    this.searchRequested.emit({
      transactionType: this.transactionType(),
      location: value.location.trim(),
      propertyType: value.propertyType,
      budgetMax: this.optionalNumber(value.budgetMax),
      bedrooms: this.optionalNumber(value.bedrooms),
      minArea: value.minArea,
      peb: value.peb === 'any' ? null : value.peb,
    })
  }
}
