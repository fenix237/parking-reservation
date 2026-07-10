import type { VehicleType } from '../compatibility/compatibility.types';

export interface PricingTier {
  upToHour: number;
  ratePerHour: number;
}

export type PricingTable = Record<VehicleType, PricingTier[]>;

export interface PriceBreakdownEntry {
  tierIndex: number;
  hoursBilled: number;
  ratePerHour: number;
  subtotal: number;
}

export interface PriceResult {
  durationMinutes: number;
  durationHours: number;
  total: number;
  breakdown: PriceBreakdownEntry[];
}