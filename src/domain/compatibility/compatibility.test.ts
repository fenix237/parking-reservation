import { describe, it, expect } from 'vitest';
import { isCompatible, getCompatibleSpotTypes } from './compatibility.logic';

describe('compatibility.logic', () => {
  it('une citadine est compatible avec une place citadine', () => {
    expect(isCompatible('citadine', 'citadine')).toBe(true);
  });

  it('une citadine est compatible avec une place familiale', () => {
    expect(isCompatible('citadine', 'familiale')).toBe(true);
  });

  it("une citadine n'est pas compatible avec une place utilitaire", () => {
    expect(isCompatible('citadine', 'utilitaire')).toBe(false);
  });

  it('une moto est compatible avec une place moto et familiale, dans cet ordre', () => {
    expect(getCompatibleSpotTypes('moto')).toEqual(['moto', 'familiale']);
  });

  it("un utilitaire n'est compatible qu'avec une place utilitaire", () => {
    expect(getCompatibleSpotTypes('utilitaire')).toEqual(['utilitaire']);
  });

  it("une moto n'est pas compatible avec une place citadine", () => {
    expect(isCompatible('moto', 'citadine')).toBe(false);
  });

  it('lève une erreur pour un type de véhicule inconnu', () => {
    // @ts-expect-error test volontaire d'un type invalide
    expect(() => getCompatibleSpotTypes('camion')).toThrow();
  });
});