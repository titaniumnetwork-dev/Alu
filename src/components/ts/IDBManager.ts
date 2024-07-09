type VALID_EXT_TYPES = "serviceWorker" | "theme" | "page";
export interface ExtensionMetadata {
  title: string;
  description?: string;

  // Versions should follow semantic versioning
  version: string;
  script: string;
  entryNamespace?: string;
  entryFunc?: string;
  scriptCopy: string | null;
  type: VALID_EXT_TYPES;
  themeName?: string;
}

export let CurrentIDB: IDBDatabase;

export function loadIDB(name: string, version: number) {
  const request = window.indexedDB.open(name, version);

  return request;
}

export function GetIDB() {
  return CurrentIDB;
}

export function SetIDB(idb: IDBDatabase) {
  CurrentIDB = idb;
}

export function GetStore(name: string, mode: IDBTransactionMode) {
  if (CurrentIDB == null) {
    throw new Error("IDB not loaded!");
  }
  return CurrentIDB.transaction(name, mode).objectStore(name);
}

export default {
  loadIDB,
  SetIDB,
  GetIDB,
  GetStore,
};
