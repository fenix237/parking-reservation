export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageError';
  }
}

export class StorageCorruptedError extends StorageError {
  constructor() {
    super('Les données du parking sont corrompues.');
    this.name = 'StorageCorruptedError';
  }
}

export class StorageVersionMismatchError extends StorageError {
  constructor() {
    super('La version des données du parking est incompatible.');
    this.name = 'StorageVersionMismatchError';
  }
}

export class StorageUnavailableError extends StorageError {
  constructor() {
    super("Le stockage du navigateur n'est pas disponible.");
    this.name = 'StorageUnavailableError';
  }
}