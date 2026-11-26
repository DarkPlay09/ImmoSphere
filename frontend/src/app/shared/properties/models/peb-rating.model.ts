export const PEB_RATINGS = ['A++', 'A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G'] as const;

export type PebRating = (typeof PEB_RATINGS)[number];

export function parsePebRating(value: string | null | undefined): PebRating | undefined {
  const normalizedValue = value?.trim().toUpperCase();

  return PEB_RATINGS.find((rating) => rating === normalizedValue);
}
