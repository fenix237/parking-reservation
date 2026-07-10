import { describe, it, expect, beforeEach } from 'vitest';
import { createInitialParkingState } from './parking.model';
import {
  checkIn,
  checkOut,
  findAvailableSpot,
  getParkingSummary,
  isParkingStateValid,
  ParkingFullError,
  VehicleNotFoundError,
  DuplicateVehicleError,
} from './parking.logic';
import type { ParkingState } from './parking.types';

const HOUR = 1000 * 60 * 60;

describe('parking.logic', () => {
  let state: ParkingState;

  beforeEach(() => {
    state = createInitialParkingState();
  });

  describe('checkIn', () => {
    it("attribue une place compatible à l'entrée d'un véhicule", () => {
      const { spot } = checkIn(state, 'AB-123-CD', 'citadine', Date.now());
      expect(spot.type).toBe('citadine');
      expect(spot.vehicle?.id).toBe('AB-123-CD');
    });

    it('refuse deux entrées pour le même véhicule', () => {
      const { state: s2 } = checkIn(state, 'AB-123-CD', 'citadine');
      expect(() => checkIn(s2, 'AB-123-CD', 'moto')).toThrow(DuplicateVehicleError);
    });

    it("lève une erreur si aucune place n'est disponible pour ce type", () => {
      let current = state;
      const utilCount = current.spots.filter((s) => s.type === 'utilitaire').length;
      for (let i = 0; i < utilCount; i++) {
        current = checkIn(current, `UTIL-${i}`, 'utilitaire').state;
      }
      expect(() => checkIn(current, 'UTIL-FULL', 'utilitaire')).toThrow(ParkingFullError);
    });

    it("bascule sur une place familiale si aucune place moto n'est libre", () => {
      let current = state;
      const motoSpotCount = current.spots.filter((s) => s.type === 'moto').length;
      for (let i = 0; i < motoSpotCount; i++) {
        current = checkIn(current, `MOTO-${i}`, 'moto').state;
      }
      const { spot } = checkIn(current, 'MOTO-OVERFLOW', 'moto');
      expect(spot.type).toBe('familiale');
    });

    it("refuse une entrée sans identifiant de véhicule", () => {
      expect(() => checkIn(state, '', 'citadine')).toThrow();
    });
  });

  describe('checkOut', () => {
    it('calcule le tarif et libère la place à la sortie', () => {
      const entryTime = Date.now();
      const { state: s2 } = checkIn(state, 'AB-123-CD', 'citadine', entryTime);
      const { state: s3, price } = checkOut(s2, 'AB-123-CD', entryTime + 2 * HOUR);

      expect(price).toBeGreaterThan(0);
      const spot = s3.spots.find((s) => s.id.startsWith('citadine'));
      expect(spot?.vehicle).toBeNull();
      expect(s3.history).toHaveLength(1);
    });

    it('lève une erreur pour un véhicule inconnu à la sortie', () => {
      expect(() => checkOut(state, 'INCONNU')).toThrow(VehicleNotFoundError);
    });
  });

  describe('findAvailableSpot', () => {
    it("retourne null si aucune place compatible n'est libre", () => {
      let current = state;
      const utilCount = current.spots.filter((s) => s.type === 'utilitaire').length;
      for (let i = 0; i < utilCount; i++) {
        current = checkIn(current, `U-${i}`, 'utilitaire').state;
      }
      expect(findAvailableSpot(current, 'utilitaire')).toBeNull();
    });
  });

  describe('getParkingSummary', () => {
    it('retourne un résumé correct par type de place', () => {
      const { state: s2 } = checkIn(state, 'AB-123-CD', 'citadine');
      const summary = getParkingSummary(s2);
      expect(summary.citadine.occupied).toBe(1);
      expect(summary.citadine.free).toBe(summary.citadine.total - 1);
    });
  });

  describe('isParkingStateValid', () => {
    it('valide un état correct', () => {
      expect(isParkingStateValid(state)).toBe(true);
    });

    it('rejette un état corrompu ou absent', () => {
      expect(isParkingStateValid({ foo: 'bar' })).toBe(false);
      expect(isParkingStateValid(null)).toBe(false);
      expect(isParkingStateValid(undefined)).toBe(false);
      expect(isParkingStateValid('not an object')).toBe(false);
    });
  });
});