/** Locale belge correspondant à chaque langue du site. */
const LOCALES: Record<string, string> = {
  fr: 'fr-BE',
  nl: 'nl-BE',
  de: 'de-BE',
  en: 'en-GB',
};

/** Formate une note avec une décimale selon la langue du site (« 4,7 » en français, « 4.7 » en anglais). */
export function formatRating(rating: number, language: string | null | undefined): string {
  return new Intl.NumberFormat(LOCALES[language ?? ''] ?? LOCALES['fr'], {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(rating);
}
