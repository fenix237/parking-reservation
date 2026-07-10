import { DEFAULT_SPOTS_BY_TYPE } from "./parking.constants";
import type { ParkingState, ParkingSpot, SpotType } from "./parking.types";

function createSpots(): ParkingSpot[] {
  const spots: ParkingSpot[] = [];

  (Object.keys(DEFAULT_SPOTS_BY_TYPE) as SpotType[]).forEach((type) => {
    const count = DEFAULT_SPOTS_BY_TYPE[type];
    for (let i = 1; i <= count; i += 1) {
      spots.push({
        id: `${type}-${i}`,
        type,
        occupiedBy: null,
      });
    }
  });

  return spots;
}

export function createInitialParkingState(): ParkingState {
  return {
    spots: createSpots(),
    vehicles: [],
  };
}