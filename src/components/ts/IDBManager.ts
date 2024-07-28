export let CurrentIDB: IDBDatabase;

function loadFailed() {
  throw new Error("Failed to load IDB!");
}

export function loadIDBPromise(name: string, version: number): Promise<IDBDatabase | Event> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(name, version);

    request.onerror = (event) => {
      reject(event);
    };

    request.onsuccess = () => {
      const idb = request.result;
      CurrentIDB = idb;
      resolve(idb);
    };

    request.onupgradeneeded = () => {
      const idb = request.result;
      CurrentIDB = idb;
      CurrentIDB.createObjectStore(name, { keyPath: "slug" });
      resolve(idb);
    };

    request.onblocked = (event) => {
      console.error("Database upgrade is blocked by another connection");
      reject(event);
    };
  });
}

export function loadIDB(name: string, version: number): IDBOpenDBRequest {
  const request = window.indexedDB.open(name, version);

  request.onblocked = () => {
    console.error("Database upgrade is blocked by another connection");
  };

  return request;
}

export function GetIDB(): IDBDatabase {
  return CurrentIDB;
}

export function SetIDB(idb: IDBDatabase) {
  CurrentIDB = idb;
}

export function CreateStore(name: string, keypath?: IDBObjectStoreParameters): IDBObjectStore {
  if (!CurrentIDB) loadFailed();
  return CurrentIDB.createObjectStore(name, keypath);
}

export function GetStore(name: string, mode: IDBTransactionMode): IDBObjectStore {
  if (!CurrentIDB) loadFailed();
  return CurrentIDB.transaction(name, mode).objectStore(name);
}

export function ValidateStoreExists(name: string): boolean {
  if (!CurrentIDB) return false;

  const storeNames = CurrentIDB.objectStoreNames;
  return storeNames.contains(name);
}

export function DeleteIDB(name: string): Promise<IDBOpenDBRequest | Event> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.deleteDatabase(name);

    request.onerror = (event) => {
      reject(event);
    };

    request.onsuccess = () => {
      resolve(request);
    };
  });
}

export default {
  loadIDB,
  loadIDBPromise,
  SetIDB,
  GetIDB,
  CreateStore,
  GetStore,
  ValidateStoreExists,
  DeleteIDB,
};
