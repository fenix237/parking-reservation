import type { ParkingState } from '../domain/parking/parking.types';
import { createInitialParkingState } from '../domain/parking/parking.model';
import { STORAGE_VERSION } from '../domain/parking/parking.constants';
import { STORAGE_KEYS } from './storageKeys';
import {
  StorageCorruptedError,
  StorageUnavailableError,
  StorageVersionMismatchError,
} from './storageErrors';

interface StoredParkingState {
  version: number;
  data: ParkingState;
}

function isStorageAvailable(): boolean {
  try {
    const key = '__storage_test__';
    localStorage.setItem(key, key);
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function loadParkingState(): ParkingState {
  if (!isStorageAvailable()) {
    throw new StorageUnavailableError();
  }

  const raw = localStorage.getItem(STORAGE_KEYS.PARKING_STATE);

  if (!raw) {
    const initialState = createInitialParkingState();
    saveParkingState(initialState);
    return initialState;
  }

  try {
    const parsed = JSON.parse(raw) as StoredParkingState;

    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      !('version' in parsed) ||
      !('data' in parsed)
    ) {
      throw new StorageCorruptedError();
    }

    if (parsed.version !== STORAGE_VERSION) {
      throw new StorageVersionMismatchError();
    }

    return parsed.data;
  } catch (error) {
    if (
      error instanceof StorageVersionMismatchError ||
      error instanceof StorageCorruptedError
    ) {
      const initialState = createInitialParkingState();
      saveParkingState(initialState);
      return initialState;
    }

    if (error instanceof SyntaxError) {
      const initialState = createInitialParkingState();
      saveParkingState(initialState);
      return initialState;
    }

    throw error;
  }
}

export function saveParkingState(state: ParkingState): void {
  if (!isStorageAvailable()) {
    throw new StorageUnavailableError();
  }

  const payload: StoredParkingState = {
    version: STORAGE_VERSION,
    data: state,
  };

  try {
    localStorage.setItem(
      STORAGE_KEYS.PARKING_STATE,
      JSON.stringify(payload)
    );
  } catch {
    throw new StorageUnavailableError();
  }
}

export function clearParkingState(): void {
  if (!isStorageAvailable()) {
    throw new StorageUnavailableError();
  }

  localStorage.removeItem(STORAGE_KEYS.PARKING_STATE);
}

export function resetParkingState(): ParkingState {
  const initialState = createInitialParkingState();
  saveParkingState(initialState);
  return initialState;
}