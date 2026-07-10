import type { VehicleType } from '../compatibility/compatibility.types';
import { getCompatibleSpotTypes } from '../compatibility/compatibility.logic';
import { calculatePrice } from '../pricing/pricing.logic';
import type {
  ParkingState,
  ParkingSpot,
  Vehicle,
  CheckInResult,
  CheckOutResult,
  ParkingSummaryByType,
} from './parking.types';

//-----Erreurs----

export class ParkingFullError extends Error {
  constructor(vehicleType: VehicleType) {
    super(`Aucune place disponible pour le type de véhicule: ${vehicleType}`);
    this.name = 'ParkingFullError';
  }
}

export class VehicleNotFoundError extends Error {
  constructor(vehicleId: string) {
    super(`Véhicule inconnu ou déjà sorti: ${vehicleId}`);
    this.name = 'VehicleNotFoundError';
  }
}

export class DuplicateVehicleError extends Error {
  constructor(vehicleId: string) {
    super(`Ce véhicule est déjà garé dans le parking: ${vehicleId}`);
    this.name = 'DuplicateVehicleError';
  }
}
 
//--------------

//Recupere la meilleure place libre pour un vehicule en fonction du type et de l'emplacement
export function findAvailableSpot(
  state: ParkingState,
  vehicleType: VehicleType
): ParkingSpot | null {
  const compatibleTypes = getCompatibleSpotTypes(vehicleType);

  for (const spotType of compatibleTypes) {
    const found = state.spots.find((spot) => spot.type === spotType && spot.vehicle === null);
    if (found) return found;
  }
  return null;
}

// Ajoute un vehicule en fonction de la compatibilite et met a jour son statut
export function checkIn(
  state: ParkingState,
  vehicleId: string,
  vehicleType: VehicleType,
  entryTime: number = Date.now()
): CheckInResult {
  if (!vehicleId || !vehicleId.trim()) {
    throw new Error("L'identifiant du véhicule est requis");
  }

  const alreadyParked = state.spots.find((spot) => spot.vehicle?.id === vehicleId);
  if (alreadyParked) {
    throw new DuplicateVehicleError(vehicleId);
  }

  const spot = findAvailableSpot(state, vehicleType);
  if (!spot) {
    throw new ParkingFullError(vehicleType);
  }

  const vehicle: Vehicle = { id: vehicleId, type: vehicleType, entryTime };

  const newSpots = state.spots.map((s) => (s.id === spot.id ? { ...s, vehicle } : s));

  return {
    state: { ...state, spots: newSpots },
    spot: { ...spot, vehicle },
  };
}

//Enregistre une sortie de vehicule, recupere le tarif et met a jour l'historique
export function checkOut(
  state: ParkingState,
  vehicleId: string,
  exitTime: number = Date.now()
): CheckOutResult {
  const spot = state.spots.find((s) => s.vehicle?.id === vehicleId);
  if (!spot || !spot.vehicle) {
    throw new VehicleNotFoundError(vehicleId);
  }

  const vehicle = spot.vehicle;
  const { total, durationMinutes } = calculatePrice(vehicle.type, vehicle.entryTime, exitTime);

  const newSpots = state.spots.map((s) => (s.id === spot.id ? { ...s, vehicle: null } : s));

  const newHistory = [
    ...state.history,
    {
      vehicleId: vehicle.id,
      vehicleType: vehicle.type,
      spotId: spot.id,
      entryTime: vehicle.entryTime,
      exitTime,
      price: total,
    },
  ];

  return {
    state: { ...state, spots: newSpots, history: newHistory },
    price: total,
    durationMinutes,
  };
}

// Recupere le resume du parking en fonction du type de place
export function getParkingSummary(state: ParkingState): Record<string, ParkingSummaryByType> {
  const summary: Record<string, ParkingSummaryByType> = {};

  for (const spot of state.spots) {
    if (!summary[spot.type]) {
      summary[spot.type] = { total: 0, occupied: 0, free: 0 };
    }
    summary[spot.type].total += 1;
    if (spot.vehicle) {
      summary[spot.type].occupied += 1;
    } else {
      summary[spot.type].free += 1;
    }
  }
  return summary;
}

//Verification etat de parking 
export function isParkingStateValid(state: unknown): state is ParkingState {
  if (!state || typeof state !== 'object') return false;
  const s = state as ParkingState;
  return Array.isArray(s.spots) && Array.isArray(s.history);
}