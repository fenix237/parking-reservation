import type { VehicleType, SpotType } from '../compatibility/compatibility.types';

export interface Vehicle {
  id: string;
  type: VehicleType;
  entryTime: number; 
}

export interface ParkingSpot {
  id: string;
  type: SpotType;
  vehicle: Vehicle | null;
}

export interface ParkingHistoryEntry {
  vehicleId: string;
  vehicleType: VehicleType;
  spotId: string;
  entryTime: number;
  exitTime: number;
  price: number;
}

export interface ParkingState {
  spots: ParkingSpot[];
  history: ParkingHistoryEntry[];
}

export interface CheckInResult {
  state: ParkingState;
  spot: ParkingSpot;
}

export interface CheckOutResult {
  state: ParkingState;
  price: number;
  durationMinutes: number;
}

export interface ParkingSummaryByType {
  total: number;
  occupied: number;
  free: number;
}