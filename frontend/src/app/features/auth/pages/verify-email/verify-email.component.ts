import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  output,
  QueryList,
  signal,
  ViewChildren,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { AuthShellComponent } from '../../../../shared/auth/components/auth-shell/auth-shell.component';

/**
 * Étape visuelle de confirmation de l'e-mail après inscription.
 * Aucun appel HTTP, stockage de code ou validation côté serveur ici.
 * Les événements publics seront reliés par le responsable de l'authentification.
 */
@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [RouterLink, TranslatePipe, AuthShellComponent],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyEmailComponent {
  readonly email = input<string | null>(null);
  readonly submitting = input(false);
  readonly canResend = input(false);
  readonly serverError = input<string | null>(null);
  readonly demoMode = input(true);

  readonly verifyRequested = output<string>();
  readonly resendRequested = output<void>();

  readonly codeLength = 6;
  readonly slots = [0, 1, 2, 3, 4, 5] as const;
  readonly digits = signal<string[]>(Array(6).fill(''));
  readonly code = computed(() => this.digits().join(''));
  readonly attempted = signal(false);
  readonly previewNoticeVisible = signal(false);
  readonly codeIncomplete = computed(
    () => this.attempted() && this.code().length !== this.codeLength,
  );

  @ViewChildren('digitInput') private digitInputs?: QueryList<ElementRef<HTMLInputElement>>;

  onDigitInput(event: Event, index: number): void {
    const field = event.target as HTMLInputElement;
    const value = field.value.replace(/\D/g, '').slice(0, this.codeLength);

    // Gère aussi le remplissage automatique mobile d'un code complet.
    if (value.length > 1) {
      this.insertDigits(value.length === this.codeLength ? 0 : index, value);
      return;
    }

    const next = [...this.digits()];
    next[index] = value;
    this.digits.set(next);
    field.value = value;
    this.clearFeedback();

    if (value && index < this.codeLength - 1) {
      this.focusDigit(index + 1);
    }
  }

  onDigitKeydown(event: KeyboardEvent, index: number): void {
    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      this.focusDigit(index - 1);
    } else if (event.key === 'ArrowRight' && index < this.codeLength - 1) {
      event.preventDefault();
      this.focusDigit(index + 1);
    } else if (event.key === 'Backspace' && !this.digits()[index] && index > 0) {
      event.preventDefault();
      const next = [...this.digits()];
      next[index - 1] = '';
      this.digits.set(next);
      this.syncInputs();
      this.clearFeedback();
      this.focusDigit(index - 1);
    }
  }

  onDigitPaste(event: ClipboardEvent, index: number): void {
    event.preventDefault();
    const pasted = (event.clipboardData?.getData('text') ?? '')
      .replace(/\D/g, '')
      .slice(0, this.codeLength);

    if (pasted) {
      this.insertDigits(pasted.length === this.codeLength ? 0 : index, pasted);
    }
  }

  submit(): void {
    this.attempted.set(true);
    this.previewNoticeVisible.set(false);

    if (this.code().length !== this.codeLength) {
      const firstEmpty = this.digits().findIndex((digit) => !digit);
      this.focusDigit(firstEmpty === -1 ? 0 : firstEmpty);
      return;
    }

    this.verifyRequested.emit(this.code());

    // Feedback transparent tant que le handler backend n'est pas branché.
    if (this.demoMode()) {
      this.previewNoticeVisible.set(true);
    }
  }

  resend(): void {
    if (this.canResend() && !this.submitting()) {
      this.resendRequested.emit();
    }
  }

  private insertDigits(start: number, value: string): void {
    const next = [...this.digits()];
    for (let offset = 0; offset < value.length && start + offset < this.codeLength; offset++) {
      next[start + offset] = value[offset];
    }
    this.digits.set(next);
    this.syncInputs();
    this.clearFeedback();
    this.focusDigit(Math.min(start + value.length, this.codeLength - 1));
  }

  private syncInputs(): void {
    this.digitInputs?.forEach((item, index) => {
      item.nativeElement.value = this.digits()[index];
    });
  }

  private focusDigit(index: number): void {
    this.digitInputs?.get(index)?.nativeElement.focus();
  }

  private clearFeedback(): void {
    this.attempted.set(false);
    this.previewNoticeVisible.set(false);
  }
}
