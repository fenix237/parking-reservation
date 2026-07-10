import type { SpotType, VehicleType } from "./parking.types";

export const PARKING_SPOT_TYPES: SpotType[] = [
  "citadine",
  "familiale",
  "utilitaire",
  "moto",
];

export const VEHICLE_TYPES: VehicleType[] = [
  "citadine",
  "familiale",
  "utilitaire",
  "moto",
];

export const DEFAULT_SPOTS_BY_TYPE: Record<SpotType, number> = {
  citadine: 6,
  familiale: 4,
  utilitaire: 3,
  moto: 5,
};

export const PARKING_STORAGE_KEY = "parking-app-state-v1";

export const COMPATIBILITY: Record<VehicleType, SpotType[]> = {
  moto: ["moto", "familiale"],
  citadine: ["citadine", "familiale"],
  familiale: ["familiale"],
  utilitaire: ["utilitaire"],
};