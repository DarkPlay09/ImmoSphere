export type NotaryAvatarTone = 'plum' | 'purple' | 'dark';

export interface Notary {
  id: string;
  initials: string;
  fullName: string;
  officeName: string;
  city: string;
  postalCode: string;
  languages: readonly string[];
  mainExpertiseKey: string;
  secondaryExpertiseKey: string;
  avatarTone: NotaryAvatarTone;
}
