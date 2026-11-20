import { AgenceMailtoPipe, toMailtoHref } from './agence-mailto.pipe';

describe('AgenceMailtoPipe', () => {
  it('construit un lien mailto: vers l’adresse de l’agence', () => {
    expect(new AgenceMailtoPipe().transform('contact@horizon-immo-liege.be')).toBe(
      'mailto:contact@horizon-immo-liege.be',
    );
  });

  it('encode les caractères réservés en gardant le @', () => {
    expect(toMailtoHref('jean+agence?x&y#z@exemple.be')).toBe('mailto:jean%2Bagence%3Fx%26y%23z@exemple.be');
  });

  it('retire les espaces autour de l’adresse', () => {
    expect(toMailtoHref('  info@immo-mosane.be ')).toBe('mailto:info@immo-mosane.be');
  });
});
