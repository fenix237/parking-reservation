import type { PricingTable } from './pricing.types';

export const PRICING_TABLE: PricingTable = {
  citadine: [
    { upToHour: 2, ratePerHour: 2000 },
    { upToHour: 6, ratePerHour: 1500 },
    { upToHour: Infinity, ratePerHour: 1000 },
  ],
  familiale: [
    { upToHour: 2, ratePerHour: 2500 },
    { upToHour: 6, ratePerHour: 2000 },
    { upToHour: Infinity, ratePerHour: 1300 },
  ],
  utilitaire: [
    { upToHour: 2, ratePerHour: 3500 },
    { upToHour: 6, ratePerHour: 2800 },
    { upToHour: Infinity, ratePerHour: 1800 },
  ],
  moto: [
    { upToHour: 3, ratePerHour: 1000 },
    { upToHour: 8, ratePerHour: 700 },
    { upToHour: Infinity, ratePerHour: 400 },
  ],
};

export const MINIMUM_BILLED_HOURS = 1;