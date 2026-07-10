import { describe, it, expect } from 'vitest';
import { calculatePrice, getBillableHours, calculateDurationMinutes } from './pricing.logic';

const HOUR = 1000 * 60 * 60;
const START = new Date('2026-01-01T10:00:00Z').getTime();

describe('pricing.logic', () => {
  describe('calculateDurationMinutes', () => {
    it('calcule correctement la durée en minutes', () => {
      expect(calculateDurationMinutes(START, START + 90 * 60 * 1000)).toBe(90);
    });

    it("lève une erreur si la sortie précède l'entrée", () => {
      expect(() => calculateDurationMinutes(START, START - 1000)).toThrow();
    });
  });

  describe('getBillableHours', () => {
    it('facture au minimum 1 heure', () => {
      expect(getBillableHours(5)).toBe(1);
    });

    it("arrondit à l'heure supérieure", () => {
      expect(getBillableHours(61)).toBe(2);
      expect(getBillableHours(120)).toBe(2);
      expect(getBillableHours(121)).toBe(3);
    });
  });

  describe('calculatePrice', () => {
    it('facture correctement une citadine garée 1h', () => {
      const result = calculatePrice('citadine', START, START + HOUR);

      expect(result.total).toBe(200);
      expect(result.durationHours).toBe(1);
    });

    it('applique correctement les deux premiers paliers pour une citadine garée 4h', () => {
      const result = calculatePrice('citadine', START, START + 4 * HOUR);

      expect(result.total).toBe(700);
      expect(result.breakdown).toHaveLength(2);
    });

    it('applique correctement les trois paliers pour une citadine garée 8h', () => {
      const result = calculatePrice('citadine', START, START + 8 * HOUR);

      expect(result.total).toBe(1200);
      expect(result.breakdown).toHaveLength(3);
    });

    it('facture au minimum une heure pour un stationnement très court', () => {
      const result = calculatePrice('moto', START, START + 5 * 60 * 1000);

      expect(result.durationHours).toBe(1);
      expect(result.total).toBe(100);
    });

    it('lève une erreur pour un type de véhicule inconnu', () => {
      // @ts-expect-error Test volontaire d'un type de véhicule invalide
      expect(() => calculatePrice('camion', START, START + HOUR)).toThrow();
    });
  });
});