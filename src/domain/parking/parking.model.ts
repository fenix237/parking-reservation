import type { SpotType } from '../compatibility/compatibility.types';
import type { ParkingSpot, ParkingState } from './parking.types';
import { SPOT_COUNTS } from './parking.constants';


// Identifiant unique pour chaque place du parking
function createSpotId(type: SpotType, index: number): string {
  return `${type}-${String(index + 1).padStart(2, '0')}`;
}

//Etat initial complet du parking
export function createInitialParkingState(): ParkingState {
  const spots: ParkingSpot[] = [];

  (Object.keys(SPOT_COUNTS) as SpotType[]).forEach((type) => {
    const count = SPOT_COUNTS[type];
    for (let i = 0; i < count; i++) {
      spots.push({
        id: createSpotId(type, i),
        type,
        vehicle: null,
      });
    }
  });

  return { spots, history: [] };
}