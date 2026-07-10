import type { PricingTable } from './pricing.types';

export const PRICING_TABLE: PricingTable = {
  citadine: [
    { upToHour: 2, ratePerHour: 200 },
    { upToHour: 6, ratePerHour: 150 },
    { upToHour: Infinity, ratePerHour: 100 },
  ],
  familiale: [
    { upToHour: 2, ratePerHour: 250 },
    { upToHour: 6, ratePerHour: 200 },
    { upToHour: Infinity, ratePerHour: 130 },
  ],
  utilitaire: [
    { upToHour: 2, ratePerHour: 350 },
    { upToHour: 6, ratePerHour: 280 },
    { upToHour: Infinity, ratePerHour: 180 },
  ],
  moto: [
    { upToHour: 3, ratePerHour: 100 },
    { upToHour: 8, ratePerHour: 70 },
    { upToHour: Infinity, ratePerHour: 40 },
  ],
};

export const MINIMUM_BILLED_HOURS = 1;