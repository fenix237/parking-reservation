import type { VehicleType, SpotType, CompatibilityMap } from './compatibility.types';

export const COMPATIBILITY_MAP: CompatibilityMap = {
  citadine: ['citadine', 'familiale'],
  familiale: ['familiale'],
  utilitaire: ['utilitaire'],
  moto: ['moto', 'familiale'],
};

export function getCompatibleSpotTypes(vehicleType: VehicleType): SpotType[] {
  const spots = COMPATIBILITY_MAP[vehicleType];
  if (!spots) {
    throw new Error(`Type de véhicule inconnu: ${vehicleType}`);
  }
  return spots;
}

export function isCompatible(vehicleType: VehicleType, spotType: SpotType): boolean {
  return getCompatibleSpotTypes(vehicleType).includes(spotType);
}