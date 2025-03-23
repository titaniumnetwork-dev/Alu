import PyrusStore from "./PyrusStore";
import IDBManager from "./IDBManager";

async function instantiatePyrus(): Promise<void> {
  return new Promise((resolve) => {
    if (globalThis.Pyrus) return;
    globalThis.Pyrus = {
      store: new PyrusStore(),
      eventList: {},
      settings: {
        loadedContentStorage: {},
        currentTab: "",
      },
    };
  
    if (!window.idb) {
      const db = IDBManager.loadIDB("PyrusDB", 1);
      db.onupgradeneeded = () => {
        window.idb = db.result;
        IDBManager.SetIDB(window.idb);
        IDBManager.CreateStore("InstalledExtensions", { keyPath: "slug" });
      };
      db.onsuccess = () => {
        window.idb = db.result;
        IDBManager.SetIDB(window.idb);
        resolve();
      };
    }
  });
}

export default instantiatePyrus;
