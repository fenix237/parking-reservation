export type VehicleType = 'citadine' | 'familiale' | 'utilitaire' | 'moto';

export type SpotType = VehicleType;

export type CompatibilityMap = Record<VehicleType, SpotType[]>;