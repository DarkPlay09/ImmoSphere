import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
  output,
} from '@angular/core';

import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ActivatedRoute, ParamMap, Params, convertToParamMap } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type TransactionFilter = 'sale' | 'rent' | null;

@Component({
  selector: 'app-property-search-results-toolbar',
  standalone: true,

  imports: [ReactiveFormsModule],

  templateUrl: './property-search-results-toolbar.component.html',
  styleUrl: './property-search-results-toolbar.component.scss',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertySearchResultsToolbarComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly transactionType = signal<TransactionFilter>(null);

  readonly bedroomsOptions = [1, 2, 3, 4, 5];

  readonly budgetOptions = computed(() => {
    if (this.transactionType() === 'rent') {
      return [500, 750, 1000, 1250, 1500, 2000, 3000];
    }

    return [100000, 150000, 200000, 250000, 300000, 400000, 500000, 750000, 1000000];
  });

  readonly form = new FormGroup({
    location: new FormControl('', {
      nonNullable: true,
    }),

    propertyType: new FormControl('all', {
      nonNullable: true,
    }),

    budgetMax: new FormControl('', {
      nonNullable: true,
    }),

    bedrooms: new FormControl('', {
      nonNullable: true,
    }),
  });

  readonly searchRequested = output<Params>();

  ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.syncFromParams(params);
    });
  }

  private syncFromParams(params: ParamMap): void {
    const transaction = params.get('transactionType');
    this.transactionType.set(transaction === 'sale' || transaction === 'rent' ? transaction : null);
    this.form.reset({
      location: params.get('location') ?? '',
      propertyType: params.get('propertyType') ?? 'all',
      budgetMax: params.get('budgetMax') ?? '',
      bedrooms: params.get('bedrooms') ?? '',
    }, { emitEvent: false });
  }

  resetDraft(): void {
    this.syncFromParams(convertToParamMap({}));
  }

  setTransactionType(type: 'sale' | 'rent'): void {
    if (this.transactionType() === type) {
      return;
    }

    this.transactionType.set(type);

    this.form.controls.budgetMax.setValue('');
  }

  formatBudget(amount: number): string {
    return `${amount.toLocaleString('fr-BE')} €`;
  }

  submit(): void {
    const values = this.form.getRawValue();

    this.searchRequested.emit({
      transactionType: this.transactionType(),
      location: values.location.trim() || null,
      propertyType: values.propertyType === 'all' ? null : values.propertyType,
      budgetMax: values.budgetMax || null,
      bedrooms: values.bedrooms || null,
    });
  }
}
