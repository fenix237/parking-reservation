export type VehicleType = "citadine" | "familiale" | "utilitaire" | "moto";
export type SpotType = "citadine" | "familiale" | "utilitaire" | "moto";
export type ParkingVehicleStatus = "parked" | "exited";

export interface ParkingVehicle {
  id: string;
  plate: string;
  type: VehicleType;
  spotId: string;
  parkedAt: string;
  exitedAt?: string;
  status: ParkingVehicleStatus;
  amountDue?: number;
}

export interface ParkingSpot {
  id: string;
  type: SpotType;
  occupiedBy: string | null;
}

export interface ParkingState {
  spots: ParkingSpot[];
  vehicles: ParkingVehicle[];
}

export interface ParkingEntryInput {
  plate: string;
  type: VehicleType;
  parkedAt?: string;
}

export interface ParkingExitResult {
  vehicle: ParkingVehicle;
  amountDue: number;
  parkedDurationMinutes: number;
}

export interface ParkingSummary {
  totalSpots: number;
  freeSpots: number;
  occupiedSpots: number;
  byType: Record<SpotType, { total: number; free: number; occupied: number }>;
}