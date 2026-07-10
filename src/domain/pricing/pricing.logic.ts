import type { VehicleType } from '../compatibility/compatibility.types';
import type { PriceBreakdownEntry, PriceResult } from './pricing.types';
import { PRICING_TABLE, MINIMUM_BILLED_HOURS } from './pricing.constants';

export function calculateDurationMinutes(entryTime: number, exitTime: number): number {
  if (exitTime < entryTime) {
    throw new Error("L'heure de sortie ne peut pas précéder l'heure d'entrée");
  }
  return Math.round((exitTime - entryTime) / (1000 * 60));
}

//Conversion des durees en minute en heure
export function getBillableHours(durationMinutes: number): number {
  const rawHours = durationMinutes / 60;
  const roundedUp = Math.ceil(rawHours);
  return Math.max(roundedUp, MINIMUM_BILLED_HOURS);
}

//Calcul du prix de stationnement des vehicules en fonctions des paliers
export function calculatePrice(
  vehicleType: VehicleType,
  entryTime: number,
  exitTime: number
): PriceResult {
  const tiers = PRICING_TABLE[vehicleType];
  if (!tiers) {
    throw new Error(`Type de véhicule inconnu: ${vehicleType}`);
  }

  const durationMinutes = calculateDurationMinutes(entryTime, exitTime);
  const billableHours = getBillableHours(durationMinutes);

  const breakdown: PriceBreakdownEntry[] = [];
  let remainingHours = billableHours;
  let previousThreshold = 0;
  let total = 0;

  for (let i = 0; i < tiers.length && remainingHours > 0; i++) {
    const tier = tiers[i];
    const tierCapacity = tier.upToHour - previousThreshold;
    const hoursInThisTier = Math.min(remainingHours, tierCapacity);

    if (hoursInThisTier > 0) {
      const subtotal = hoursInThisTier * tier.ratePerHour;
      breakdown.push({
        tierIndex: i,
        hoursBilled: hoursInThisTier,
        ratePerHour: tier.ratePerHour,
        subtotal,
      });
      total += subtotal;
      remainingHours -= hoursInThisTier;
    }
    previousThreshold = tier.upToHour;
  }

  return {
    durationMinutes,
    durationHours: billableHours,
    total: Math.round(total * 100) / 100,
    breakdown,
  };
}